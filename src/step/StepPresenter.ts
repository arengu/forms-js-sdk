import keyBy from 'lodash/keyBy';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

import { InvalidFields, FieldError } from '../error/InvalidFields';

import { ValidateFields, IStepValidationResult } from './interactor/StepValidator';

import { Messages } from '../lib/Messages';

import { IStepModel } from './model/StepModel';
import { IFieldModel, IFieldValue } from '../field/model/FieldModel';
import { IPresenter } from '../base/Presenter';
import { IFieldPresenterListener, IFieldPresenter, FieldPresenter } from '../field/presenter/FieldPresenter';
import { IStepView, StepView } from './view/StepView';
import { AppErrorCode } from '../error/ErrorCodes';
import { InvalidStep } from '../error/InvalidStep';
import { ArenguError } from '../error/ArenguError';
import { IUserValues, IFormData } from '../form/model/SubmissionModel';
import { IComponentPresenter, IComponentModel, ComponentCategory } from '../component/ComponentTypes';
import { ComponentHelper } from '../component/ComponentHelper';
import { BlockPresenter } from '../block/BlockPresenter';
import { NextButtonPresenter, INextButtonPresenter } from '../block/navigation/next/NextButtonPresenter';

export interface IStepListener {
  onGoPrevious(this: this): void;
}

export interface IStepPresenter extends IPresenter<IStepView> {
  getStepId(): string;

  startAsync(this: this): void;
  endAsync(this: this): void;

  isDynamic(this: this): boolean;
  updateStep(this: this, data: IFormData): void;

  hasStepValidation(this: this): boolean;
  validate(this: this): Promise<IStepValidationResult>;
  getUserValues(this: this): Promise<IUserValues>;

  handleAnyError(this: this, err: Error): void;
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
  createComponentFactory(fieldL: IFieldPresenterListener, stepL: IStepListener,
    messages: Messages): IComponentCreator {
    return function componentCreator(compM: IComponentModel): IComponentPresenter {
      switch (compM.category) {
        case ComponentCategory.FIELD:
          return FieldPresenter.create(compM, fieldL, messages);
        case ComponentCategory.BLOCK:
          return BlockPresenter.create(compM, stepL);
      }
    };
  },

  async getValue(fieldP: IFieldPresenter): Promise<IPairFieldIdValue> {
    return {
      fieldId: fieldP.getFieldId(),
      value: await fieldP.getValue(),
    };
  },

  hasValue(pair: IPairFieldIdValue): boolean {
    return !isNil(pair.value) && !isEmpty(pair.value);
  },
}

export class StepPresenter implements IStepPresenter, IFieldPresenterListener {
  protected readonly stepM: IStepModel;

  protected readonly invalidFields: Set<string>;

  protected readonly messages: Messages

  protected readonly compsP: IComponentPresenter[];

  protected readonly nextsP: INextButtonPresenter[];

  protected readonly fieldsP: IFieldPresenter[];
  protected readonly dynFieldsP: IFieldPresenter[];
  protected readonly fieldsPI: Record<string, IFieldPresenter>; // indexed by fieldId

  protected readonly stepV: IStepView;

  protected loadings: number;

  protected disablements: number;

  protected constructor(stepM: IStepModel, stepL: IStepListener, messages: Messages) {
    this.stepM = stepM;
    this.invalidFields = new Set();
    this.messages = messages;

    this.compsP = stepM.components.map(StepPresenterHelper.createComponentFactory(this, stepL, messages));

    this.nextsP = this.compsP.filter(NextButtonPresenter.matches);

    this.fieldsP = this.compsP.filter(ComponentHelper.isFieldPresenter);
    this.dynFieldsP = this.fieldsP.filter((fP): boolean => fP.isDynamic());
    this.fieldsPI = keyBy(this.fieldsP, (fP) => fP.getFieldId());

    const compsV = this.compsP.map((cP) => cP.getView());
    this.stepV = StepView.create(stepM, compsV);

    this.loadings = 0;
    this.disablements = 0;
  }

  public static create(stepM: IStepModel, stepL: IStepListener,
    messages: Messages): IStepPresenter {
    return new StepPresenter(stepM, stepL, messages);
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

  public getView(): IStepView {
    return this.stepV;
  }

  public isDynamic(this: this): boolean {
    return this.dynFieldsP.length > 0;
  }

  public updateStep(this: this, data: IFormData): void {
    this.dynFieldsP.forEach((sP): void => sP.updateField(data));
  }

  public hasStepValidation(this: this): boolean {
    return this.stepM.onNext;
  }

  public async validate(): Promise<IStepValidationResult> {
    const result = await ValidateFields.execute(this.fieldsP);

    if (!result.valid) {
      this.handleFieldErrors(result.errors);
    }

    return result;
  }

  /**
   * Returns a map with all the data provided by the user in this step
   */
  public async getUserValues(): Promise<IUserValues> {
    const indexedValues: IUserValues = {};

    const proms = this.fieldsP.map((fP) => StepPresenterHelper.getValue(fP));

    const allValues = await Promise.all(proms);
    const validValues = allValues.filter((v) => StepPresenterHelper.hasValue(v));

    validValues.forEach((pair): void => {
      indexedValues[pair.fieldId] = pair.value;
    });

    return indexedValues;
  }

  public showLoading(): void {
    if (this.loadings === 0) {
      this.nextsP.forEach((nP) => nP.showLoading());
    }
    this.loadings += 1;
  }

  public hideLoading(): void {
    this.loadings -= 1;
    if (this.loadings === 0) {
      this.nextsP.forEach((nP) => nP.hideLoading());
    }
  }

  public enableActions(): void {
    this.disablements -= 1;
    if (this.disablements === 0) {
      this.nextsP.forEach((nP) => nP.enable());
    }
  }

  public disableActions(): void {
    if (this.disablements === 0) {
      this.nextsP.forEach((nP) => nP.disable());
    }
    this.disablements += 1;
  }

  public startAsync(): void {
    this.disableActions();
    this.showLoading();
  }

  public endAsync(): void {
    this.hideLoading();
    this.enableActions();
  }

  public handleFieldError(err: FieldError): void {
    const { fieldId } = err;

    const fieldP = this.getFieldPresenter(fieldId);
    fieldP.handleFieldError(err);
  }

  public handleInvalidFields(err: InvalidFields): void {
    return err.fields.forEach((fE) => this.handleFieldError(fE));
  }

  public handleFieldErrors(errs: FieldError[]): void {
    return errs.forEach((fE) => this.handleFieldError(fE));
  }

  public handleInvalidStep(err: InvalidStep): void {
    this.setError(err.message);
  }

  public handleArenguError(err: ArenguError): void {
    const msg = this.messages.fromError(err);
    this.setError(msg);
  }

  public handleGenericError(err: Error): void {
    this.setError(err.message);
  }

  public handleAnyError(err: Error): void {
    if (err instanceof InvalidFields) {
      this.handleInvalidFields(err);
    } else if (err instanceof InvalidStep) {
      this.handleInvalidStep(err);
    } else if (err instanceof ArenguError) {
      this.handleArenguError(err);
    } else {
      this.handleGenericError(err);
    }
  }

  public reset(): void {
    this.compsP.forEach((cP) => cP.reset());
    this.stepV.reset();
  }

  public hasInvalidFields(): boolean {
    return this.invalidFields.size > 0;
  }

  public setError(msg: string): void {
    this.stepV.setError(msg);
  }

  public clearError(): void {
    this.stepV.clearError();
  }

  protected notifyInvalidFields(): void {
    const code = AppErrorCode.INVALID_INPUT;
    const msg = this.messages.fromCode(code);
    this.setError(msg);
  }

  public onInvalidField(error: FieldError, message: string, fieldP: IFieldPresenter): void {
    const fieldId = fieldP.getFieldId();

    if (!this.hasInvalidFields()) {
      this.notifyInvalidFields();
      this.disableActions();
    }

    this.invalidFields.add(fieldId);
  }

  public onValidField(fieldP: IFieldPresenter): void {
    const fieldId = fieldP.getFieldId();

    this.invalidFields.delete(fieldId);

    if (!this.hasInvalidFields()) {
      this.clearError();
      this.enableActions();
    }
  }
}
