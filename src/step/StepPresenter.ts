import keyBy from 'lodash/keyBy';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

import { InvalidFields, FieldError } from '../error/InvalidFields';

import { ValidateFields, IStepValidationResult } from './interactor/StepValidator';

import { Messages } from '../lib/Messages';

import { IStepModel } from './model/StepModel';
import { IFieldModel, IFieldValue } from '../field/model/FieldModel';
import { IFieldPresenter } from '../field/presenter/presenter/FieldPresenter';
import { IStepView, StepView } from './view/StepView';
import { AppErrorCode } from '../error/ErrorCodes';
import { ArenguError } from '../error/ArenguError';
import { IUserValues, IFormData } from '../form/model/SubmissionModel';
import { IComponentModel } from '../component/ComponentModel';
import { ComponentHelper } from '../component/ComponentHelper';
import { IFormDeps } from '../form/FormPresenter';
import { ComponentPresenter, IComponentPresenterListener, IComponentPresenter } from '../component/ComponentPresenter';
import { ISocialFieldPresenter, SocialFieldPresenter } from '../field/presenter/presenter/SocialFieldPresenter';
import { IPresenter } from '../core/BaseTypes';
import { StepErrorPresenter, IStepErrorPresenter } from './part/StepErrorPresenter';
import { IExtendedFormStyle } from '../form/model/FormStyle';
import { IRefScope } from '../form/model/FormModel';
import { IPreviousButtonPresenter } from '../block/navigation/button/PreviousButton';
import { INextButtonPresenter, NextButtonPresenter } from '../block/navigation/button/NextButton';
import { IJumpButtonPresenter } from '../block/navigation/button/JumpButton';

export interface IStepPresenterListener {
  onPreviousButton?(this: this, buttonP: IPreviousButtonPresenter, stepP: IStepPresenter): void;
  onNextButton?(this: this, buttonP: INextButtonPresenter, stepP: IStepPresenter): void;
  onJumpButton?(this: this, buttonP: IJumpButtonPresenter, stepP: IStepPresenter): void;
  onSocialLogin?(this: this, compP: ISocialFieldPresenter, stepP: IStepPresenter): void;
}

export interface IStepPresenter extends IPresenter {
  getStepId(): string;

  blockComponents(): void;
  unblockComponents(): void;

  onShow(): void;
  onHide(): void;

  isDynamic(): boolean;
  updateStep(formData: IFormData): void;
  onUpdateStyle(style: IExtendedFormStyle): void;

  getFieldPresenter(fieldId: string): IFieldPresenter | undefined;

  hasFlow(): boolean;
  validateFields(): Promise<IStepValidationResult>;
  getUserValues(): Promise<IUserValues>;

  handleAnyError(err: Error): void;
  handleAnyError(err: string): void;

  clearAllErrors(): void;

  fireNextStep(): void;
}

export interface IPairFieldIdValue {
  readonly fieldId: string;
  readonly value: IFieldValue;
}

export interface IFieldPresenterCreator {
  (fieldM: IFieldModel): IFieldPresenter;
}

export interface IComponentCreator {
  (compM: IComponentModel): IComponentPresenter;
}

export const StepPresenterHelper = {
  async getValue(fieldP: IFieldPresenter): Promise<IPairFieldIdValue> {
    return {
      fieldId: fieldP.getFieldId(),
      value: await fieldP.getValue(),
    };
  },

  hasValue(pair: IPairFieldIdValue): boolean {
    return !isNil(pair.value) && !isEmpty(pair.value);
  },

  insertAt<T>(arr: T[], pos: number, elem: T): T[] {
    const output = Array.from(arr);
    output.splice(pos, 0, elem);
    return output;
  },

  addError(compsP: IComponentPresenter[], errorP: IStepErrorPresenter): IComponentPresenter[] {
    const firstIndex = compsP.findIndex(NextButtonPresenter.matches);

    if (firstIndex >= 0) {
      return StepPresenterHelper.insertAt(compsP, firstIndex, errorP);
    }

    return [...compsP, errorP];
  },
}

export class StepPresenter implements IStepPresenter, IComponentPresenterListener {
  protected readonly stepM: IStepModel;
  protected readonly messages: Messages

  protected readonly compsP: IComponentPresenter[];

  protected readonly invalidFields: Set<string>;
  protected readonly fieldsP: IFieldPresenter[];
  protected readonly fieldsPI: Record<string, IFieldPresenter>; // indexed by fieldId

  protected readonly dynComponentsP: IComponentPresenter[];

  protected readonly errorP: IStepErrorPresenter;

  protected readonly stepV: IStepView;
  protected readonly stepL: IStepPresenterListener;

  protected activeFieldsP: IFieldPresenter[]; // fields we have to include/omit based on the trigger

  protected constructor(stepM: IStepModel, formD: IFormDeps, stepL: IStepPresenterListener) {
    this.stepM = stepM;
    this.messages = formD.messages;

    this.compsP = stepM.components.map((cM) => ComponentPresenter.create(formD, cM));
    this.compsP.forEach((cP) => cP.listen(this));

    this.invalidFields = new Set();
    this.fieldsP = this.compsP.filter(ComponentHelper.isFieldPresenter);
    this.fieldsPI = keyBy(this.fieldsP, (fP) => fP.getFieldId());

    this.dynComponentsP = this.compsP.filter((cP): boolean => cP.isDynamic());

    this.errorP = StepErrorPresenter.create();

    const stepComps = StepPresenterHelper.addError(this.compsP, this.errorP);
    const compsE = stepComps.map((cP) => cP.render());
    this.stepV = StepView.create(stepM, compsE);
    this.stepL = stepL;

    this.activeFieldsP = [];
  }

  public static create(stepM: IStepModel, formD: IFormDeps, stepL: IStepPresenterListener): IStepPresenter {
    return new StepPresenter(stepM, formD, stepL);
  }

  public getStepId(): string {
    return this.stepM.id;
  }

  public getFieldPresenter(fieldId: string): IFieldPresenter | undefined {
    const fieldP = this.fieldsPI[fieldId];

    return fieldP || undefined;
  }

  public render(): HTMLElement {
    return this.stepV.render();
  }

  public isDynamic(): boolean {
    return this.dynComponentsP.length > 0;
  }

  public updateStep(formData: IFormData): void {
    // we have to support temporarily both old and new formats to ensure backward compatibility
    const newScope: IRefScope = { field: formData, ...formData };
    this.dynComponentsP.forEach((cP): void => cP.updateContent(newScope));
  }

  public hasFlow(): boolean {
    return this.stepM.onNext;
  }

  public async validateFields(): Promise<IStepValidationResult> {
    return ValidateFields.execute(this.activeFieldsP);
  }

  /**
   * Returns a map with all the data provided by the user in this step
   */
  public async getUserValues(): Promise<IUserValues> {
    const indexedValues: IUserValues = {};

    const proms = this.activeFieldsP.map((fP) => StepPresenterHelper.getValue(fP));

    const allValues = await Promise.all(proms);
    const validValues = allValues.filter((v) => StepPresenterHelper.hasValue(v));

    validValues.forEach((pair): void => {
      indexedValues[pair.fieldId] = pair.value;
    });

    return indexedValues;
  }

  public unblockComponents(): void {
    this.compsP.forEach((cP) => cP.unblock && cP.unblock());
  }

  public blockComponents(): void {
    this.compsP.forEach((cP) => cP.block && cP.block());
  }

  public onShow(): void {
    this.activeFieldsP = [];

    this.compsP.forEach((cP) => cP.onShow && cP.onShow());
  }

  public onHide(): void {
    this.compsP.forEach((cP) => cP.onHide && cP.onHide());
  }

  public handleFieldError(err: FieldError): void {
    const { fieldId } = err;

    const fieldP = this.getFieldPresenter(fieldId);
    fieldP?.handleFieldError(err);
  }

  public handleInvalidFields(err: InvalidFields): void {
    return err.fields.forEach((fE) => this.handleFieldError(fE));
  }

  public handleArenguError(err: ArenguError): void {
    const msg = this.messages.fromError(err);
    this.setStepError(msg);
  }

  public handleAnyError(err: Error | string): void {
    if (err instanceof InvalidFields) {
      this.handleInvalidFields(err);
    } else if (err instanceof ArenguError) {
      this.handleArenguError(err);
    } else if (err instanceof Error) {
      this.setStepError(err.message);
    } else {
      this.setStepError(err);
    }
  }

  public reset(): void {
    this.compsP.forEach((cP) => cP.reset());
  }

  public hasInvalidFields(): boolean {
    return this.invalidFields.size > 0;
  }

  public setStepError(msg: string): void {
    this.errorP.setError(msg);
  }

  public clearStepError(): void {
    this.errorP.clearError();
  }

  public clearFieldErrors(): void {
    this.fieldsP.forEach((p) => p.clearError());
    this.invalidFields.clear();
  }

  public clearAllErrors(): void {
    this.clearStepError();
    this.clearFieldErrors();
  }

  protected notifyInvalidFields(): void {
    const code = AppErrorCode.INVALID_INPUT;
    const msg = this.messages.fromCode(code);
    this.setStepError(msg);
  }

  public onInvalidField(error: FieldError, message: string, fieldP: IFieldPresenter): void {
    const fieldId = fieldP.getFieldId();

    if (!this.hasInvalidFields()) {
      this.notifyInvalidFields();
    }

    this.invalidFields.add(fieldId);
  }

  public onValidField(fieldP: IFieldPresenter): void {
    const fieldId = fieldP.getFieldId();

    this.invalidFields.delete(fieldId);

    if (!this.hasInvalidFields()) {
      this.clearStepError();
    }
  }

  public onPreviousButton(buttonP: IPreviousButtonPresenter): void {
    this.stepL.onPreviousButton?.(buttonP, this);
  }

  public onNextButton(buttonP: INextButtonPresenter): void {
    this.activeFieldsP = this.fieldsP.filter((fP) => SocialFieldPresenter.matches(fP) === false)

    this.stepL.onNextButton?.(buttonP, this);
  }

  public onJumpButton(buttonP: IJumpButtonPresenter): void {
    this.activeFieldsP = [];

    this.stepL.onJumpButton?.(buttonP, this);
  }

  public onSocialLogin(fieldP: ISocialFieldPresenter): void {
    this.activeFieldsP = [fieldP];

    this.stepL.onSocialLogin && this.stepL.onSocialLogin(fieldP, this);
  }

  public onUpdateStyle(style: IExtendedFormStyle): void {
    this.fieldsP.forEach((fieldP) => fieldP.onUpdateStyle(style));
  }

  public fireNextStep(): void {
    const nextButtonsP = this.compsP.filter(NextButtonPresenter.matches);

    if (nextButtonsP.length === 1) {
      this.onNextButton(nextButtonsP[0]);
    }
  }
}
