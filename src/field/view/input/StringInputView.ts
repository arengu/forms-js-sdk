import { IInputView } from '../InputView';

export type IStringInputValue = string;

export interface IStringInputElement extends HTMLElement {
  value: string;
  defaultValue: string;
}

export type IStringInputView = IInputView<IStringInputValue>;

export abstract class StringInputView implements IStringInputView {
  protected readonly inputE: IStringInputElement;

  protected readonly rootE: HTMLElement;

  protected constructor(inputE: IStringInputElement, rootE?: HTMLElement) {
    this.inputE = inputE;
    this.rootE = rootE || inputE;
  }

  public getValue(): IStringInputValue {
    return this.inputE.value.trim();
  }

  public setValue(value: IStringInputValue): void {
    this.inputE.value = value;
  }

  public reset(): void {
    this.inputE.value = this.inputE.defaultValue;
  }

  public render(): HTMLElement {
    return this.rootE;
  }
}
