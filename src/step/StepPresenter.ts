import keyBy from 'lodash/keyBy';
import findIndex from 'lodash/findIndex';
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
import { NextButtonPresenter, INextButtonPresenter } from '../block/navigation/next/NextButtonPresenter';
import { IFormDeps } from '../form/FormPresenter';
import { ComponentPresenter, IComponentPresenterListener, IComponentPresenter } from '../component/ComponentPresenter';
import { ISocialFieldPresenter, SocialFieldPresenter } from '../field/presenter/presenter/SocialFieldPresenter';
import { IPresenter } from '../core/BaseTypes';
import { StepErrorPresenter, IStepErrorPresenter } from './part/StepErrorPresenter';
import { IExtendedFormStyle } from '../form/model/FormStyle';
import { IRefScope } from '../form/model/FormModel';

export interface IStepPresenterListener {
  onGotoPreviousStep?(this: this, stepP: IStepPresenter): void;
  onSocialLogin?(this: this, stepP: IStepPresenter, compP: ISocialFieldPresenter): void;
}

export interface IStepPresenter extends IPresenter {
  getStepId(): string;

  showLoading(this: this): void;
  hideLoading(this: this): void;

  blockComponents(this: this): void;
  unblockComponents(this: this): void;

  onShow(this: this): void;
  onHide(this: this): void;

  isDynamic(this: this): boolean;
  updateStep(this: this, formData: IFormData): void;
  onUpdateStyle(style: IExtendedFormStyle): void;

  hasFlow(this: this): boolean;
  validate(this: this): Promise<IStepValidationResult>;
  getUserValues(this: this): Promise<IUserValues>;

  setStepError(msg: string): void;
  handleAnyError(this: this, err: Error): void;

  clearAllErrors(): void;
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
    const nextIndex = findIndex(compsP, NextButtonPresenter.matches);

    if (nextIndex >= 0) {
      return StepPresenterHelper.insertAt(compsP, nextIndex, errorP);
    }

    const socialIndex = findIndex(compsP, SocialFieldPresenter.matches);

    if (socialIndex >= 0) {
      return StepPresenterHelper.insertAt(compsP, socialIndex, errorP);
    }

    return [...compsP, errorP];
  }
}

export class StepPresenter implements IStepPresenter, IComponentPresenterListener {
  protected readonly stepM: IStepModel;
  protected readonly messages: Messages

  protected readonly compsP: IComponentPresenter[];

  protected readonly invalidFields: Set<string>;
  protected readonly fieldsP: IFieldPresenter[];
  protected readonly fieldsPI: Record<string, IFieldPresenter>; // indexed by fieldId

  protected readonly dynComponentsP: IComponentPresenter[];

  protected readonly nextsP: INextButtonPresenter[];

  protected readonly errorP: IStepErrorPresenter;

  protected readonly stepV: IStepView;
  protected readonly stepL: IStepPresenterListener;

  /** Indicates if social login has been used in this step */
  protected lastSocialP?: ISocialFieldPresenter;

  protected constructor(stepM: IStepModel, formD: IFormDeps, stepL: IStepPresenterListener) {
    this.stepM = stepM;
    this.messages = formD.messages;

    this.compsP = stepM.components.map((cM) => ComponentPresenter.create(formD, cM));
    this.compsP.forEach((cP) => cP.listen(this));

    this.invalidFields = new Set();
    this.fieldsP = this.compsP.filter(ComponentHelper.isFieldPresenter);
    this.fieldsPI = keyBy(this.fieldsP, (fP) => fP.getFieldId());

    this.dynComponentsP = this.compsP.filter((cP): boolean => cP.isDynamic());

    this.nextsP = this.compsP.filter(NextButtonPresenter.matches);

    this.errorP = StepErrorPresenter.create();

    const stepComps = StepPresenterHelper.addError(this.compsP, this.errorP);
    const compsE = stepComps.map((cP) => cP.render());
    this.stepV = StepView.create(stepM, compsE);
    this.stepL = stepL;
  }

  public static create(stepM: IStepModel, formD: IFormDeps, stepL: IStepPresenterListener): IStepPresenter {
    return new StepPresenter(stepM, formD, stepL);
  }

  public getStepId(): string {
    return this.stepM.id;
  }

  public getFieldPresenter(fieldId: string): IFieldPresenter {
    const fieldP = this.fieldsPI[fieldId];

    if (isNil(fieldP)) {
      throw new Error('Field not found');
    }

    return fieldP;
  }

  public render(): HTMLElement {
    return this.stepV.render();
  }

  public isDynamic(this: this): boolean {
    return this.dynComponentsP.length > 0;
  }

  public updateStep(this: this, formData: IFormData): void {
    // we have to support temporarily both old and new formats to ensure backward compatibility
    const newScope: IRefScope = { field: formData, ...formData };
    this.dynComponentsP.forEach((cP): void => cP.updateContent(newScope));
  }

  public hasFlow(this: this): boolean {
    return this.stepM.onNext;
  }

  public getActiveFields(): IFieldPresenter[] {
    /* Ignore the rest of fields when social login is used */
    return this.lastSocialP?.hasValue() ? [this.lastSocialP] : this.fieldsP;
  }

  public async validate(): Promise<IStepValidationResult> {
    const fieldsP = this.getActiveFields();

    return ValidateFields.execute(fieldsP);
  }

  /**
   * Returns a map with all the data provided by the user in this step
   */
  public async getUserValues(): Promise<IUserValues> {
    const indexedValues: IUserValues = {};

    const fieldsP = this.getActiveFields();

    const proms = fieldsP.map((fP) => StepPresenterHelper.getValue(fP));

    const allValues = await Promise.all(proms);
    const validValues = allValues.filter((v) => StepPresenterHelper.hasValue(v));

    validValues.forEach((pair): void => {
      indexedValues[pair.fieldId] = pair.value;
    });

    return indexedValues;
  }

  public showLoading(): void {
    this.nextsP.forEach((nP) => nP.showLoading());
  }

  public hideLoading(): void {
    this.nextsP.forEach((nP) => nP.hideLoading());
  }

  public unblockComponents(): void {
    this.compsP.forEach((cP) => cP.unblock && cP.unblock());
  }

  public blockComponents(): void {
    this.compsP.forEach((cP) => cP.block && cP.block());
  }

  public onShow(): void {
    this.clearSocialLogin();
    this.compsP.forEach((cP) => cP.onShow && cP.onShow());
  }

  public onHide(): void {
    this.compsP.forEach((cP) => cP.onHide && cP.onHide());
  }

  public handleFieldError(err: FieldError): void {
    const { fieldId } = err;

    const fieldP = this.getFieldPresenter(fieldId);
    fieldP.handleFieldError(err);
  }

  public handleInvalidFields(err: InvalidFields): void {
    this.clearSocialLogin();

    return err.fields.forEach((fE) => this.handleFieldError(fE));
  }

  public handleArenguError(err: ArenguError): void {
    this.clearSocialLogin();

    const msg = this.messages.fromError(err);
    this.setStepError(msg);
  }

  public handleAnyError(err: Error): void {
    if (err instanceof InvalidFields) {
      this.handleInvalidFields(err);
    } else if (err instanceof ArenguError) {
      this.handleArenguError(err);
    } else {
      this.setStepError(err.message);
    }
  }

  public reset(): void {
    this.compsP.forEach((cP) => cP.reset());
  }

  public clearSocialLogin(): void {
    this.lastSocialP?.clearValue();
  }

  public hasInvalidFields(): boolean {
    return this.invalidFields.size > 0;
  }

  public setStepError(msg: string): void {
    this.clearSocialLogin();
    this.errorP.setError(msg);
  }

  public clearStepError(): void {
    this.errorP.clearError();
  }

  public clearFieldErrors(): void {
    this.fieldsP.forEach((p) => p.clearError());
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

  public onGoToPrevious(): void {
    this.stepL.onGotoPreviousStep && this.stepL.onGotoPreviousStep(this);
  }

  public onSocialLogin(fieldP: ISocialFieldPresenter): void {
    this.lastSocialP = fieldP;
    this.stepL.onSocialLogin && this.stepL.onSocialLogin(this, fieldP);
  }

  public onUpdateStyle(style: IExtendedFormStyle): void {
    this.fieldsP.forEach((fieldP) => fieldP.onUpdateStyle(style));
  }
}
