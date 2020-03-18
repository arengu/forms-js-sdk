import { IInputView, BaseInputView } from '../InputView';
import { InputConfigurator, IStringInputElement } from './InputHelper';

export type IStringInputValue = string;

export interface IStringInputView extends IInputView {
  getValue(): IStringInputValue;
  setValue(value: IStringInputValue): void;
}

export abstract class StringInputView extends BaseInputView implements IStringInputView {
  protected readonly inputE: IStringInputElement;
  protected readonly rootE: HTMLElement;

  protected constructor(inputE: IStringInputElement, rootE?: HTMLElement) {
    super();

    this.inputE = inputE;
    this.rootE = rootE || inputE;

    InputConfigurator.addListeners(this.inputE, this);
  }

  public getInputId(): string {
    return this.inputE.id;
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

  public block(): void {
    this.inputE.disabled = true;
  }

  public unblock(): void {
    this.inputE.disabled = false;
  }

  public render(): HTMLElement {
    return this.rootE;
  }
}
