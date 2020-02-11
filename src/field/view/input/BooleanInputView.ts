import { IInputViewListener, IInputView } from '../InputView';
import { InputHelper, InputConfigurator } from './InputHelper';
import { HTMLHelper } from '../../../lib/view/HTMLHelper';
import { IBooleanFieldModel } from '../../model/FieldModel';
import { UID } from '../../../lib/UID';

export interface IBooleanOptionData {
  readonly uid: string;
  readonly fieldId: string;
  readonly label: string;
  readonly value: IBooleanInputValue;
  readonly defaultValue: string;
}

export abstract class BooleanInputRenderer {
  public static renderInput(option: IBooleanOptionData,
    inputL: IInputViewListener): HTMLInputElement {
    const valueStr = option.value.toString();

    const radio = document.createElement('input');
    radio.id = option.uid;
    radio.name = option.fieldId;
    radio.type = 'radio';
    radio.value = valueStr;
    radio.checked = (option.value === option.defaultValue);

    InputConfigurator.addListeners(radio, inputL);

    return radio;
  }

  public static renderLabel(option: IBooleanOptionData): HTMLLabelElement {
    const node = document.createElement('label');
    node.setAttribute('for', option.uid);
    node.textContent = option.label;

    return node;
  }

  public static renderOption(option: IBooleanOptionData,
    inputL: IInputViewListener): HTMLDivElement {
    const container = document.createElement('div');
    container.classList.add('af-boolean-option');

    container.appendChild(this.renderInput(option, inputL));
    container.appendChild(this.renderLabel(option));

    return container;
  }

  public static renderAllOptions(fieldM: IBooleanFieldModel,
    inputL: IInputViewListener): HTMLDivElement[] {
    const { defaultValue } = fieldM.config;

    return [
      this.renderOption(
        {
          uid: UID.create(),
          fieldId: fieldM.id,
          value: 'false',
          label: 'No',
          defaultValue,
        },
        inputL,
      ),
      this.renderOption(
        {
          uid: UID.create(),
          fieldId: fieldM.id,
          value: 'true',
          label: 'Yes',
          defaultValue,
        },
        inputL,
      ),
    ];
  }

  public static renderRoot(fieldM: IBooleanFieldModel, inputL: IInputViewListener): HTMLDivElement {
    const root = document.createElement('div');
    root.classList.add('af-boolean');

    const options = this.renderAllOptions(fieldM, inputL);
    options.forEach(HTMLHelper.appendChild(root));

    return root;
  }
}

export type IBooleanInputValue = 'false' | 'true';

export type IBooleanInputView = IInputView<IBooleanInputValue>;

export class BooleanInputView implements IBooleanInputView {
  protected rootE: HTMLDivElement;

  protected optionsE: HTMLInputElement[];

  protected constructor(fieldM: IBooleanFieldModel, inputL: IInputViewListener) {
    this.rootE = BooleanInputRenderer.renderRoot(fieldM, inputL);
    this.optionsE = Array.from(this.rootE.querySelectorAll('input'));
  }

  public static create(fieldM: IBooleanFieldModel, inputL: IInputViewListener): BooleanInputView {
    return new this(fieldM, inputL);
  }

  public async getValue(): Promise<IBooleanInputValue> {
    const checkedInput = this.optionsE.find(InputHelper.isChecked);

    if (!checkedInput) {
      throw new Error('No input was chosen');
    }

    const { value } = checkedInput;

    switch (value) {
      case 'true':
      case 'false':
        return value;
      default:
        throw new Error('Unexpected value');
    }
  }

  public async setValue(): Promise<void> { // eslint-disable-line class-methods-use-this
    throw new Error('Not supported yet');
  }

  public reset(): void {
    this.optionsE.forEach(InputHelper.resetCheck);
  }

  public render(): HTMLDivElement {
    return this.rootE;
  }
}
