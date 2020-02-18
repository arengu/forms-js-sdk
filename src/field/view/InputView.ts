import { IHTMLView } from '../../base/view/HTMLView';

export interface IInputViewListener {
  onFocus(this: this): void;
  onInput(this: this): void;
  onChange(this: this): void;
  onBlur(this: this): void;
}

export type IInputView = IHTMLView;

export type ISingleOptionValue = string | undefined;
export type IMultiOptionValue = string[];