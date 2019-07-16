import { IInputViewListener, IInputView } from '../InputView';
import { InputCreator, InputConfigurator } from './InputHelper';
import { ILegalFieldModel } from '../../model/FieldModel';
import { IBooleanInputValue } from './BooleanInputView';

const LegalInputType = 'checkbox';

export class LegalInputRenderer {
  public static renderInput(fieldM: ILegalFieldModel, uid: string,
    inputL: IInputViewListener): HTMLInputElement {
    const input = InputCreator.input(fieldM, uid, LegalInputType);

    InputConfigurator.addListeners(input, inputL);
    input.value = 'true';

    return input;
  }

  public static renderLabel(fieldM: ILegalFieldModel, uid: string): HTMLLabelElement {
    const { text } = fieldM.config;

    const label = document.createElement('label');
    label.setAttribute('for', uid);

    if (text) {
      label.innerHTML = text;
    }

    if (fieldM.required) {
      label.classList.add('af-legal-required');
    }

    return label;
  }

  public static renderRoot(fieldM: ILegalFieldModel, uid: string,
    inputE: HTMLInputElement): HTMLDivElement {
    const container = document.createElement('div');
    container.classList.add('af-legal');

    container.appendChild(inputE);
    container.appendChild(this.renderLabel(fieldM, uid));

    return container;
  }
}

export type ILegalInputValue = IBooleanInputValue;

export type ILegalInputView = IInputView<ILegalInputValue>;

export class LegalInputView implements ILegalInputView {
  protected readonly inputE: HTMLInputElement;

  protected readonly rootE: HTMLElement;

  protected constructor(fieldM: ILegalFieldModel, uid: string, inputL: IInputViewListener) {
    this.inputE = LegalInputRenderer.renderInput(fieldM, uid, inputL);
    this.rootE = LegalInputRenderer.renderRoot(fieldM, uid, this.inputE);
  }

  public static create(fieldM: ILegalFieldModel, uid: string,
    inputL: IInputViewListener): LegalInputView {
    return new this(fieldM, uid, inputL);
  }

  public async getValue(): Promise<ILegalInputValue> {
    return this.inputE.checked ? 'true' : 'false';
  }

  public reset(): void {
    this.inputE.checked = this.inputE.defaultChecked;
  }

  public render(): HTMLElement {
    return this.rootE;
  }
}
