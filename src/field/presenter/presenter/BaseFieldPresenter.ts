import debounce from 'lodash/debounce';
import escapeHE from 'lodash/escape';

import { FieldError } from '../../../error/InvalidFields';
import { IFormDeps } from '../../../form/FormPresenter';
import { IFormData } from '../../../form/model/SubmissionModel';
import { DOMEvents, EventNames } from '../../../lib/DOMEvents';
import { MagicString } from '../../../lib/MagicString';
import { Messages } from '../../../lib/Messages';
import { IFieldModel, IFieldValue } from '../../model/FieldModel';
import { FieldView, IFieldView } from '../../view/FieldView';
import { IInputView, IInputViewListener } from '../../view/InputView';
import { IFieldPresenter } from './FieldPresenter';
import { IValueHandler } from '../handler/ValueHandler';
import { IFieldValidationResult, IFieldValidator } from '../validator/FieldValidator';
import { BaseComponentPresenter } from '../../../component/ComponentHelper';
import { IExtendedFormStyle } from '../../../form/model/FormStyle';

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
    DOMEvents.emit(EventNames.BlurField, {
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
    DOMEvents.emit(EventNames.ChangeField, {
      fieldId: this.getFieldId(),
      value: await this.getValue(),
    });
  }

  public async onFocus(this: this): Promise<void> {
    DOMEvents.emit(EventNames.FocusField, {
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
    const { label, hint } = this.fieldM;
    return MagicString.isDynamic(hint) || MagicString.isDynamic(label);
  }

  public updateContent(this: this, data: IFormData): void {
    const initLabel = this.fieldM.label;

    if (initLabel) {
      const dynLabel = MagicString.render(initLabel, data, escapeHE);
      this.fieldV.updateLabel(dynLabel);
    }

    const initHint = this.fieldM.hint;

    if (initHint) {
      const dynHint = MagicString.render(initHint, data, escapeHE);
      this.fieldV.updateHint(dynHint);
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

  public onUpdateStyle(style: IExtendedFormStyle): void {
    if (this.inputV.onUpdateStyle) {
      this.inputV.onUpdateStyle(style);
    }
  }
}
