import { IInputView } from '../InputView';

export type ISimpleInputValue = string;

export interface ISimpleInputElement extends HTMLElement {
  value: string;
  defaultValue: string;
}

export abstract class SimpleInputView implements IInputView<ISimpleInputValue> {
  protected readonly inputE: ISimpleInputElement;

  protected readonly rootE: HTMLElement;

  protected constructor(inputE: ISimpleInputElement, rootE?: HTMLElement) {
    this.inputE = inputE;
    this.rootE = rootE || inputE;
  }

  public async getValue(): Promise<ISimpleInputValue> {
    return this.inputE.value.trim();
  }

  public reset(): void {
    this.inputE.value = this.inputE.defaultValue;
  }

  public render(): HTMLElement {
    return this.rootE;
  }
}
