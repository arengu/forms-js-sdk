import keyBy from 'lodash/keyBy';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

import { InvalidFields, FieldError } from '../../error/InvalidFields';

import { ValidateFields, IStepValidationResult } from '../interactor/ValidateFields';

import { Messages } from '../../lib/Messages';

import { IStepModel } from '../model/StepModel';
import { IFieldModel, IFieldValue } from '../../field/model/FieldModel';
import { IPresenter } from '../../base/Presenter';
import { IFieldPresenterListener, IFieldPresenter } from '../../field/presenter/FieldPresenter';
import { IStepView, StepView, IStepViewListener } from '../view/StepView';
import { AppErrorCode } from '../../error/ErrorCodes';
import { InvalidStep } from '../../error/InvalidStep';
import { ArenguError } from '../../error/ArenguError';
import { FieldPresenterFactory } from '../../field/presenter/FieldPresenterFactory';
import { IUserValues, IFormData } from '../../form/model/SubmissionModel';
import { IAnyFieldView } from '../../field/view/FieldView';

export type IStepListener = IStepViewListener;

export interface IStepPresenter extends IPresenter<IStepView> {
  getStepId(): string;

  startAsync(this: this): void;
  endAsync(this: this): void;

  isDynamic(this: this): boolean;
  updateStep(this: this, data: IFormData): void;

  hasStepValidation(this: this): boolean;
  validateFields(this: this): Promise<IStepValidationResult>;
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

export abstract class StepPresenterHelper {
  public static createFieldPresenter(fieldL: IFieldPresenterListener,
    messages: Messages): IFieldPresenterCreator {
    return function creator(this: void, fieldM: IFieldModel): IFieldPresenter {
      return FieldPresenterFactory.create(fieldM, fieldL, messages);
    };
  }

  public static getFieldId(fieldP: IFieldPresenter): string {
    return fieldP.getFieldId();
  }

  public static async getValue(fieldP: IFieldPresenter): Promise<IPairFieldIdValue> {
    return {
      fieldId: fieldP.getFieldId(),
      value: await fieldP.getValue(),
    };
  }

  public static reset(presenter: IFieldPresenter): void {
    return presenter.reset();
  }

  public static getView(fieldP: IFieldPresenter): IAnyFieldView {
    return fieldP.getView();
  }

  public static hasValue(pair: IPairFieldIdValue): boolean {
    return !isNil(pair.value) && !isEmpty(pair.value);
  }
}

export class StepPresenter implements IStepPresenter, IFieldPresenterListener {
  protected readonly stepM: IStepModel;

  protected readonly invalidFields: Set<string>;

  protected readonly messages: Messages

  protected readonly fieldsP: IFieldPresenter[];

  protected readonly dynFieldsP: IFieldPresenter[];

  /**
   * Components indexed by identifier
   */
  protected readonly fieldsPI: Record<string, IFieldPresenter>;

  protected readonly stepV: IStepView;

  protected loadings: number;

  protected disablements: number;

  protected constructor(stepM: IStepModel, stepL: IStepListener, messages: Messages) {
    this.stepM = stepM;
    this.invalidFields = new Set();
    this.messages = messages;
    this.fieldsP = stepM.components.map(StepPresenterHelper.createFieldPresenter(this, messages));
    this.dynFieldsP = this.fieldsP.filter((fP): boolean => fP.isDynamic());
    this.fieldsPI = keyBy(this.fieldsP, StepPresenterHelper.getFieldId);
    const fieldsV = this.fieldsP.map(StepPresenterHelper.getView, StepPresenterHelper);
    this.stepV = StepView.create(stepM, fieldsV, stepL);
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

  public async validateFields(): Promise<IStepValidationResult> {
    return ValidateFields.execute(this.fieldsP);
  }

  /**
   * Returns a map with all the data provided by the user in this step
   */
  public async getUserValues(): Promise<IUserValues> {
    const indexedValues: IUserValues = {};

    const proms = this.fieldsP.map(StepPresenterHelper.getValue);

    const allValues = await Promise.all(proms);
    const validValues = allValues.filter(StepPresenterHelper.hasValue);

    validValues.forEach((pair): void => {
      indexedValues[pair.fieldId] = pair.value;
    });

    return indexedValues;
  }

  public showLoading(): void {
    if (this.loadings === 0) {
      this.stepV.showLoading();
    }
    this.loadings += 1;
  }

  public hideLoading(): void {
    this.loadings -= 1;
    if (this.loadings === 0) {
      this.stepV.hideLoading();
    }
  }

  public disableActions(): void {
    if (this.disablements === 0) {
      this.stepV.disableNavigation();
    }
    this.disablements += 1;
  }

  public enableActions(): void {
    this.disablements -= 1;
    if (this.disablements === 0) {
      this.stepV.enableNavigation();
    }
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
    return err.fields.forEach(this.handleFieldError, this);
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
    this.fieldsP.forEach(StepPresenterHelper.reset);
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
