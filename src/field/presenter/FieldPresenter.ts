import debounce from 'lodash/debounce';
import isNil from 'lodash/isNil';
import isString from 'lodash/isString';

import { FieldError } from '../../error/InvalidFields';
import { IPresenter } from '../../base/Presenter';
import {
  IFieldValue, IBooleanFieldValue, IChoiceFieldValue, IDateFieldValue, IDropdownFieldValue,
  IEmailFieldValue, ILegalFieldValue, INumberFieldValue, IPasswordFieldValue, IPaymentFieldValue,
  ITelFieldValue, ITextFieldValue, IURLFieldValue, IFieldModel,
} from '../model/FieldModel';
import { IInputView, IInputViewListener, IInputValue } from '../view/InputView';
import {
  IFieldView, IBooleanFieldView, IChoiceFieldView, IDateFieldView, IDropdownFieldView,
  IEmailFieldView, ILegalFieldView, INumberFieldView, IPasswordFieldView, IPaymentFieldView,
  ITelFieldView, ITextFieldView, IURLFieldView, IFieldViewListener, IInputFactory,
} from '../view/FieldView';
import { IFieldValidationResult, IFieldValidator } from './validator/FieldValidator';
import { IValueHandler } from './handler/ValueHandler';
import { Messages } from '../../lib/Messages';
import { EventsFactory } from '../../lib/EventsFactory';
import { IFormData } from '../../form/model/SubmissionModel';
import { MagicString } from '../../lib/MagicString';

export interface IFieldPresenterListener {
  onValidField(this: this, fieldP: IAnyFieldPresenter): void;
  onInvalidField(this: this, error: FieldError, message: string, fieldP: IAnyFieldPresenter): void;
}

export interface IFieldPresenter<FV extends IFieldView<IInputView<IInputValue>, IInputValue>,
  FVA extends IFieldValue> extends IPresenter<FV> {
  getFieldId(this: this): string;
  getValue(this: this): Promise<FVA>;

  isDynamic(this: this): boolean;
  updateField(this: this, data: IFormData): void;

  validate(this: this): Promise<IFieldValidationResult>;

  handleFieldError(this: this, err: FieldError): void;
}

export type IAnyFieldPresenter = IFieldPresenter<IFieldView<IInputView<IInputValue>,
  IInputValue>, IFieldValue>;

export type IBooleanFieldPresenter = IFieldPresenter<IBooleanFieldView, IBooleanFieldValue>;
export type IChoiceFieldPresenter = IFieldPresenter<IChoiceFieldView, IChoiceFieldValue>;
export type IDateFieldPresenter = IFieldPresenter<IDateFieldView, IDateFieldValue>;
export type IDropdownFieldPresenter = IFieldPresenter<IDropdownFieldView, IDropdownFieldValue>;
export type IEmailFieldPresenter = IFieldPresenter<IEmailFieldView, IEmailFieldValue>;
export type ILegalFieldPresenter = IFieldPresenter<ILegalFieldView, ILegalFieldValue>;
export type INumberFieldPresenter = IFieldPresenter<INumberFieldView, INumberFieldValue>;
export type IPasswordFieldPresenter = IFieldPresenter<IPasswordFieldView, IPasswordFieldValue>;
export type IPaymentFieldPresenter = IFieldPresenter<IPaymentFieldView, IPaymentFieldValue>;
export type ITelFieldPresenter = IFieldPresenter<ITelFieldView, ITelFieldValue>;
export type ITextFieldPresenter = IFieldPresenter<ITextFieldView, ITextFieldValue>;
export type IURLFieldPresenter = IFieldPresenter<IURLFieldView, IURLFieldValue>;

export interface IFieldFactory<FM extends IFieldModel, FV extends IFieldView<IV, IInputValue>,
  IV extends IInputView<IInputValue>, FVA extends IFieldValue> extends IInputFactory<FM,
  IV> {
  createFieldView(fieldM: FM, fieldL: IFieldViewListener): FV;
  createValidator(): IFieldValidator<FM, IV, FVA>;
  createHandler(): IValueHandler<FM, IV, FVA>;
}

export interface IFieldPresenterDeps<FM extends IFieldModel, FV extends IFieldView<IV, IInputValue>,
  IV extends IInputView<IInputValue>, FVA extends IFieldValue> {
  readonly fieldM: FM;
  readonly fieldL: IFieldPresenterListener;
  readonly fieldF: IFieldFactory<FM, FV, IV, FVA>;
  readonly messages: Messages;
}

export class FieldPresenter<FM extends IFieldModel, FV extends IFieldView<IV, IInputValue>,
  IV extends IInputView<IInputValue>, FVA extends IFieldValue> implements
  IFieldPresenter<FV, FVA>, IInputViewListener {
  protected readonly fieldM: FM;

  protected readonly fieldL: IFieldPresenterListener;

  protected readonly messages: Messages;

  protected invalid: boolean;

  protected readonly fieldV: FV;

  protected readonly inputV: IV;

  protected readonly valueH: IValueHandler<FM, IV, FVA>;

  protected readonly validator: IFieldValidator<FM, IV, FVA>;

  protected readonly debouncedValidate: Function;

  protected constructor(deps: IFieldPresenterDeps<FM, FV, IV, FVA>) {
    this.fieldM = deps.fieldM;
    this.fieldL = deps.fieldL;
    this.messages = deps.messages;
    this.invalid = false;
    this.fieldV = deps.fieldF.createFieldView(this.fieldM, this);
    this.inputV = this.fieldV.getInput();
    this.validator = deps.fieldF.createValidator();

    this.valueH = deps.fieldF.createHandler();

    this.debouncedValidate = debounce(this.validate, 500);
  }

  public static create<FM extends IFieldModel, FV extends IFieldView<IV, IInputValue>,
    IV extends IInputView<IInputValue>, FVA extends IFieldValue>(
      deps: IFieldPresenterDeps<FM, FV, IV, FVA>,
  ): IFieldPresenter<FV, FVA> {
    return new this(deps);
  }

  public getFieldId(): string {
    return this.fieldM.id;
  }

  public async getValue(): Promise<FVA> {
    return this.valueH.getValue(this.inputV, this.fieldM);
  }

  protected hasError(): boolean {
    return this.invalid;
  }

  public getView(): FV {
    return this.fieldV;
  }

  public async onBlur(): Promise<void> {
    EventsFactory.onBlurField({
      fieldId: this.getFieldId(),
      value: await this.getValue(),
    });
  }

  public onInput(): void {
    if (this.hasError()) {
      this.debouncedValidate();
    }
  }

  public async onChange(): Promise<void> {
    EventsFactory.onChangeField({
      fieldId: this.getFieldId(),
      value: await this.getValue(),
    });
  }

  public async onFocus(this: this): Promise<void> {
    EventsFactory.onFocusField({
      fieldId: this.getFieldId(),
      value: await this.getValue(),
    });
  }

  public reset(): void {
    this.invalid = false;
    this.fieldV.reset();
  }

  public handleFieldError(err: FieldError): void {
    const msg = this.messages.fromError(err);
    this.fieldV.setError(msg);

    this.invalid = true;
    this.fieldL.onInvalidField(err, msg, this);
  }

  protected handleValidValue(): void {
    this.fieldV.clearError();

    this.invalid = false;
    this.fieldL.onValidField(this);
  }

  public isDynamic(this: this): boolean {
    const { label } = this.fieldM;
    return isString(label) && MagicString.isDynamic(label);
  }

  public updateField(this: this, data: IFormData): void {
    if (isNil(this.fieldV)) {
      return;
    }

    const template = this.fieldM.label || '';
    const label = MagicString.render(template, data);
    this.fieldV.updateLabel(label);
  }

  public async validate(): Promise<IFieldValidationResult> {
    const value = await this.getValue();
    const result = await this.validator.validate(value, this.fieldM, this.inputV);

    if (result.valid) {
      this.handleValidValue();
    } else {
      this.handleFieldError(result.error);
    }

    return result;
  }
}
