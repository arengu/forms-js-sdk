import { IView } from "../../core/BaseTypes";
import { ListenableEntity, IListenableEntity } from '../../lib/ListenableEntity';
import { IExtendedFormStyle } from "../../form/model/FormStyle";

export interface IHTMLInputListener {
  onFocus(this: this): void;
  onInput(this: this): void;
  onChange(this: this): void;
  onBlur(this: this): void;
}

export interface IInputViewListener {
  onFocus?(this: this): void;
  onInput?(this: this): void;
  onChange?(this: this): void;
  onBlur?(this: this): void;
}

export interface IInputView extends IView, IListenableEntity<IInputViewListener> {
  getInputId?(): string;
  render(): HTMLElement;
  reset(): void;
  block(): void;
  unblock(): void;
  onShow?(): void;
  onHide?(): void;
  onUpdateStyle?(style: IExtendedFormStyle): void;
}

export type ISingleOptionValue = string | undefined;
export type IMultiOptionValue = string[];

export abstract class BaseInputView extends ListenableEntity<IInputViewListener> implements IHTMLInputListener {
  public onFocus(this: this): void {
    this.listeners.forEach((l) => l.onFocus && l.onFocus());
  }
  public onInput(this: this): void {
    this.listeners.forEach((l) => l.onInput && l.onInput());
  }
  public onChange(this: this): void {
    this.listeners.forEach((l) => l.onChange && l.onChange());
  }
  public onBlur(this: this): void {
    this.listeners.forEach((l) => l.onBlur && l.onBlur());
  }
}