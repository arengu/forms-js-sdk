import debounce from 'lodash/debounce';
import isNil from 'lodash/isNil';
import isString from 'lodash/isString';
import { IPresenter } from '../../base/Presenter';
import { FieldError } from '../../error/InvalidFields';
import { IFormData } from '../../form/model/SubmissionModel';
import { EventsFactory } from '../../lib/EventsFactory';
import { MagicString } from '../../lib/MagicString';
import { Messages } from '../../lib/Messages';
import { UID } from '../../lib/UID';
import { URLHelper } from '../../lib/URLHelper';
import { IFieldModel, IFieldValue } from '../model/FieldModel';
import { FieldView, IFieldView } from '../view/FieldView';
import { IInputView, IInputViewListener } from '../view/InputView';
import { IValueHandler } from './handler/ValueHandler';
import { IFieldValidationResult, IFieldValidator } from './validator/FieldValidator';
import { IFieldFactory } from '../FieldFactory';
import { IFieldPresenterListener } from './FieldPresenter';

export interface IGenericFieldPresenter<FVA extends IFieldValue> extends IPresenter<IFieldView> {
  getFieldId(this: this): string;
  getValue(this: this): Promise<FVA>;

  isDynamic(this: this): boolean;
  updateField(this: this, data: IFormData): void;

  validate(this: this): Promise<IFieldValidationResult>;

  handleFieldError(this: this, err: FieldError): void;
}

export class GenericFieldPresenter<FM extends IFieldModel, IV extends IInputView, FVA extends IFieldValue> implements
  IGenericFieldPresenter<FVA>, IInputViewListener {
  protected readonly uid: string;

  protected readonly fieldM: FM;

  protected readonly fieldL: IFieldPresenterListener;

  protected readonly messages: Messages;

  protected invalid: boolean;

  protected readonly inputV: IV;

  protected readonly fieldV: IFieldView;

  protected readonly valueH: IValueHandler<FM, IV, FVA>;

  protected readonly validator: IFieldValidator<FM, IV, FVA>;

  protected readonly debouncedValidate: Function;

  protected constructor(fieldM: FM, fieldL: IFieldPresenterListener, messages: Messages,
    factory: IFieldFactory<FM, IV, FVA>) {
    this.uid = UID.create();

    this.fieldM = fieldM;
    this.fieldL = fieldL;
    this.messages = messages;
    this.invalid = false;
    this.inputV = factory.createInputView(this.fieldM, this.uid, this);
    this.fieldV = FieldView.create(this.fieldM, this.uid, this.inputV);
    this.validator = factory.createValidator();

    this.valueH = factory.createHandler();

    this.debouncedValidate = debounce(this.validate, 500);

    this.initValue();
  }

  public static create<FM extends IFieldModel, IV extends IInputView, FVA extends IFieldValue>
    (fieldM: FM, fieldL: IFieldPresenterListener, messages: Messages,
      factory: IFieldFactory<FM, IV, FVA>): IGenericFieldPresenter<FVA> {
    return new GenericFieldPresenter(fieldM, fieldL, messages, factory);
  }

  public getFieldId(): string {
    return this.fieldM.id;
  }

  public initValue(): void {
    const urlValue = URLHelper.getParam(this.getFieldId());
    const anyValue = urlValue as any; // eslint-disable-line @typescript-eslint/no-explicit-any

    if (!isNil(urlValue)) {
      this.valueH.setValue(this.inputV, anyValue, this.fieldM);
    }
  }

  public async getValue(): Promise<FVA> {
    return this.valueH.getValue(this.inputV, this.fieldM);
  }

  protected hasError(): boolean {
    return this.invalid;
  }

  public getView(): IFieldView {
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
    const result = this.validator.validate(value, this.fieldM, this.inputV);

    if (result.valid) {
      this.handleValidValue();
    } else {
      this.handleFieldError(result.error);
    }

    return result;
  }
}
