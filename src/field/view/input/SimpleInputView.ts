import { IInputView } from '../InputView';

export type ISimpleInputValue = string;

export interface ISimpleInputElement extends HTMLElement {
  value: string;
  defaultValue: string;
}

export type ISimpleInputView = IInputView<ISimpleInputValue>;

export abstract class SimpleInputView implements ISimpleInputView {
  protected readonly inputE: ISimpleInputElement;

  protected readonly rootE: HTMLElement;

  protected constructor(inputE: ISimpleInputElement, rootE?: HTMLElement) {
    this.inputE = inputE;
    this.rootE = rootE || inputE;
  }

  public async getValue(): Promise<ISimpleInputValue> {
    return this.inputE.value.trim();
  }

  public async setValue(value: ISimpleInputValue): Promise<void> {
    this.inputE.value = value;
  }

  public reset(): void {
    this.inputE.value = this.inputE.defaultValue;
  }

  public render(): HTMLElement {
    return this.rootE;
  }
}
