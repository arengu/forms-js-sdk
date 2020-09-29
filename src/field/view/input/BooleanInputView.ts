import { IInputView, BaseInputView } from '../InputView';
import { InputHelper, InputConfigurator } from './InputHelper';
import { HTMLHelper } from '../../../lib/view/HTMLHelper';
import { IBooleanFieldModel } from '../../model/FieldModel';
import { UID } from '../../../lib/UID';
import defaultTo from 'lodash/defaultTo';

export interface IBooleanOptionData {
  readonly uid: string;
  readonly fieldId: string;
  readonly label: string;
  readonly value: IBooleanInputValue;
  readonly defaultValue: string;
}

export const BooleanInputRenderer = {
  renderInput(option: IBooleanOptionData,
    inputV: BooleanInputView): HTMLInputElement {
    const valueStr = option.value.toString();

    const radio = document.createElement('input');
    radio.id = option.uid;
    radio.name = option.fieldId;
    radio.type = 'radio';
    radio.value = valueStr;
    radio.checked = (option.value === option.defaultValue);

    InputConfigurator.addListeners(radio, inputV);

    return radio;
  },

  renderLabel(option: IBooleanOptionData): HTMLLabelElement {
    const node = document.createElement('label');
    node.setAttribute('for', option.uid);
    node.textContent = option.label;

    return node;
  },

  renderOption(option: IBooleanOptionData,
    inputV: BooleanInputView): HTMLDivElement {
    const container = document.createElement('div');
    container.classList.add('af-boolean-option');

    container.appendChild(this.renderInput(option, inputV));
    container.appendChild(this.renderLabel(option));

    return container;
  },

  renderAllOptions(fieldM: IBooleanFieldModel,
    inputV: BooleanInputView): HTMLDivElement[] {
    const { defaultValue, options } = fieldM.config;

    return [
      this.renderOption(
        {
          uid: UID.create(),
          fieldId: fieldM.id,
          value: 'false',
          label: defaultTo(options?.false, 'No'),
          defaultValue,
        },
        inputV,
      ),
      this.renderOption(
        {
          uid: UID.create(),
          fieldId: fieldM.id,
          value: 'true',
          label: defaultTo(options?.true, 'Yes'),
          defaultValue,
        },
        inputV,
      ),
    ];
  },

  renderRoot(fieldM: IBooleanFieldModel, inputV: BooleanInputView): HTMLDivElement {
    const root = document.createElement('div');
    root.classList.add('af-boolean');

    const options = this.renderAllOptions(fieldM, inputV);
    options.forEach(HTMLHelper.appendChild(root));

    return root;
  },
};

export type IBooleanInputValue = 'false' | 'true';

export type IBooleanInputView = IInputView;

export class BooleanInputView extends BaseInputView implements IBooleanInputView {
  protected rootE: HTMLDivElement;

  protected optionsE: HTMLInputElement[];

  protected constructor(fieldM: IBooleanFieldModel) {
    super();

    this.rootE = BooleanInputRenderer.renderRoot(fieldM, this);
    this.optionsE = Array.from(this.rootE.querySelectorAll('input'));
  }

  public static create(fieldM: IBooleanFieldModel): BooleanInputView {
    return new this(fieldM);
  }

  public getValue(): IBooleanInputValue {
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
        throw new Error(`Unexpected value ${value}`);
    }
  }

  public setValue(): void { // eslint-disable-line class-methods-use-this
    throw new Error('Not supported yet');
  }

  public reset(): void {
    this.optionsE.forEach(InputHelper.resetCheck);
  }

  public block(): void {
    this.optionsE.forEach((o) => o.disabled = true);
  }

  public unblock(): void {
    this.optionsE.forEach((o) => o.disabled = false);
  }

  public render(): HTMLDivElement {
    return this.rootE;
  }
}
