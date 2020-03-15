import { IInputViewListener, IInputView, BaseInputView } from '../InputView';
import { InputCreator, InputConfigurator } from './InputHelper';
import { ILegalFieldModel } from '../../model/FieldModel';
import { IBooleanInputValue } from './BooleanInputView';

const LegalInputType = 'checkbox';

export const LegalInputRenderer = {
  renderInput(fieldM: ILegalFieldModel,
    inputV: LegalInputView): HTMLInputElement {
    const input = InputCreator.input(fieldM, LegalInputType);

    InputConfigurator.addListeners(input, inputV);
    input.value = 'true';

    return input;
  },

  renderLabel(fieldM: ILegalFieldModel, uid: string): HTMLLabelElement {
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
  },

  renderRoot(fieldM: ILegalFieldModel,
    inputE: HTMLInputElement): HTMLDivElement {
    const container = document.createElement('div');
    container.classList.add('af-legal');

    container.appendChild(inputE);
    container.appendChild(this.renderLabel(fieldM, inputE.id));

    return container;
  },
};

export type ILegalInputValue = IBooleanInputValue;

export type ILegalInputView = IInputView;

export class LegalInputView extends BaseInputView<IInputViewListener> implements ILegalInputView {
  protected readonly inputE: HTMLInputElement;

  protected readonly rootE: HTMLElement;

  protected constructor(fieldM: ILegalFieldModel) {
    super();

    this.inputE = LegalInputRenderer.renderInput(fieldM, this);
    this.rootE = LegalInputRenderer.renderRoot(fieldM, this.inputE);
  }

  public static create(fieldM: ILegalFieldModel): LegalInputView {
    return new this(fieldM);
  }

  public getValue(): ILegalInputValue {
    return this.inputE.checked ? 'true' : 'false';
  }

  public setValue(): void { // eslint-disable-line class-methods-use-this
    // automatic check of legal fields is not allowed
  }

  public reset(): void {
    this.inputE.checked = this.inputE.defaultChecked;
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
