import debounce from 'lodash/debounce';
import isString from 'lodash/isString';
import escapeHE from 'lodash/escape';

import { FieldError } from '../../../error/InvalidFields';
import { IFormDeps } from '../../../form/FormPresenter';
import { IFormData } from '../../../form/model/SubmissionModel';
import { EventsFactory } from '../../../lib/EventsFactory';
import { MagicString } from '../../../lib/MagicString';
import { Messages } from '../../../lib/Messages';
import { IFieldModel, IFieldValue } from '../../model/FieldModel';
import { FieldView, IFieldView } from '../../view/FieldView';
import { IInputView, IInputViewListener } from '../../view/InputView';
import { IFieldPresenter } from './FieldPresenter';
import { IValueHandler } from '../handler/ValueHandler';
import { IFieldValidationResult, IFieldValidator } from '../validator/FieldValidator';
import { BaseComponentPresenter } from '../../../component/ComponentHelper';

export abstract class BaseFieldPresenter<IV extends IInputView = IInputView> extends BaseComponentPresenter implements IFieldPresenter, IInputViewListener {
  protected readonly fieldM: IFieldModel;

  protected readonly messages: Messages;

  protected invalid: boolean;

  protected readonly inputV: IV;

  protected readonly fieldV: IFieldView;

  protected readonly valueH: IValueHandler<IFieldValue>;

  protected readonly validator: IFieldValidator<IFieldValue>;

  protected readonly debouncedValidate: Function;

  protected constructor(
    formD: IFormDeps, fieldM: IFieldModel, inputV: IV,
    fieldVal: IFieldValidator<IFieldValue>, valueH: IValueHandler<IFieldValue>) {
    super();

    this.fieldM = fieldM;
    this.messages = formD.messages;
    this.invalid = false;
    this.inputV = inputV;
    this.fieldV = FieldView.create(this.fieldM, this.inputV);
    this.validator = fieldVal;

    this.valueH = valueH;

    this.debouncedValidate = debounce(this.validate, 500);

    this.inputV.listen(this);
  }

  public getFieldId(): string {
    return this.fieldM.id;
  }

  public async getValue(): Promise<IFieldValue> {
    return this.valueH.getValue();
  }

  protected hasError(): boolean {
    return this.invalid;
  }

  public render(): HTMLElement {
    return this.fieldV.render();
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

  public block(): void {
    this.inputV.block();
  }

  public unblock(): void {
    this.inputV.unblock();
  }

  public reset(): void {
    this.invalid = false;
    this.inputV.reset();
    this.fieldV.reset();
  }

  public setError(msg: string): void {
    this.fieldV.setError(msg);
    this.invalid = true;
  }

  public clearError(): void {
    this.fieldV.clearError();
    this.invalid = false;
  }

  public handleFieldError(err: FieldError): void {
    const msg = this.messages.fromError(err);
    this.setError(msg);

    this.listeners.forEach((listener) => listener.onInvalidField && listener.onInvalidField(err, msg, this));
  }

  protected handleValidValue(): void {
    this.clearError();

    this.listeners.forEach((listener) => listener.onValidField && listener.onValidField(this));
  }

  public onHide(): void {
    this.clearError();
  }

  public isDynamic(this: this): boolean {
    const { label } = this.fieldM;
    return isString(label) && MagicString.isDynamic(label);
  }

  public updateField(this: this, data: IFormData): void {
    const template = this.fieldM.label;

    if (template) {
      const label = MagicString.render(template, data, escapeHE);
      this.fieldV.updateLabel(label);
    }
  }

  public async validate(): Promise<IFieldValidationResult> {
    const value = await this.getValue();
    const result = this.validator.validate(value);

    if (result.valid) {
      this.handleValidValue();
    } else {
      this.handleFieldError(result.error);
    }

    return result;
  }
}
