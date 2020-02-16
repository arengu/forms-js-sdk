import { IHTMLView } from '../../base/view/HTMLView';
import { IPaymentInputValue } from './input/PaymentInputView';
import { IBooleanInputValue } from './input/BooleanInputView';
import { IChoiceInputValue } from './input/ChoiceInputView';
import { IDateInputValue } from './input/DateInputView';
import { IDropdownInputValue } from './input/DropdownInputView';
import { IEmailInputValue } from './input/EmailInputView';
import { ILegalInputValue } from './input/LegalInputView';
import { INumberInputValue } from './input/NumberInputView';
import { IPasswordInputValue } from './input/PasswordInputView';
import { ITelInputValue } from './input/TelInputView';
import { ITextInputValue } from './input/TextInputView';
import { IURLInputValue } from './input/URLInputView';

export interface IInputViewListener {
  onFocus(this: this): void;
  onInput(this: this): void;
  onChange(this: this): void;
  onBlur(this: this): void;
}

export interface IInputView<IVA extends IInputValue> extends IHTMLView {
  getValue(): IVA;
  setValue(value: IVA): void;
}

export type ISingleOptionValue = string | undefined;
export type IMultiOptionValue = string[];

export type IInputValue = IBooleanInputValue | IChoiceInputValue | IDateInputValue |
  IDropdownInputValue | IEmailInputValue | ILegalInputValue | INumberInputValue |
  IPasswordInputValue | IPaymentInputValue | ITelInputValue | ITextInputValue |
  IURLInputValue;
