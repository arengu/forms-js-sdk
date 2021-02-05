import includes from 'lodash/includes';
import isNil from 'lodash/isNil';

import {
  IInputView, ISingleOptionValue, IMultiOptionValue, BaseInputView,
} from '../InputView';
import { HTMLHelper } from '../../../lib/view/HTMLHelper';
import { UID } from '../../../lib/UID';
import { InputConfigurator, InputHelper } from './InputHelper';
import { ICardsFieldModel, ICardsOptionModel } from '../../model/FieldModel';

export enum CardsInputType {
  Single = 'radio',
  Multiple = 'checkbox',
}

export interface IOptionInputData {
  readonly uid: string;
  readonly value: string;
}

export interface IOptionLabelData {
  readonly uid: string;
  readonly label: string;
}

export const CardsInputRenderer = {
  isDefault(fieldM: ICardsFieldModel, value: string): boolean {
    const { defaultValue, multiple } = fieldM.config;

    return !isNil(defaultValue)
      && (
        multiple
          ? includes(defaultValue, value)
          : defaultValue === value
      );
  },

  renderOptionInput(fieldM: ICardsFieldModel, inputV: CardsInputView,
    inputData: IOptionInputData): HTMLInputElement {
    const { multiple } = fieldM.config;

    const inputType = multiple ? CardsInputType.Multiple : CardsInputType.Single;
    const node = document.createElement('input');
    node.type = inputType;

    node.id = inputData.uid;
    node.name = fieldM.id;
    node.value = inputData.value;

    if (this.isDefault(fieldM, inputData.value)) {
      node.setAttribute('checked', 'checked');
    }

    InputConfigurator.addListeners(node, inputV);

    return node;
  },

  renderOptionLabel(
    uid: string,
    label: string,
    hideLabel: boolean,
    imageUrl: string
  ): HTMLLabelElement {
    const elem = document.createElement('label');
    elem.setAttribute('for', uid);

    const imageContainer = document.createElement('div');
    imageContainer.classList.add('af-cards-option-image');

    const image = document.createElement('img');
    image.src = imageUrl;
    image.alt = label;

    imageContainer.appendChild(image);
    elem.appendChild(imageContainer);

    if(!hideLabel) {
      const textContainer = document.createElement('div');
      textContainer.classList.add('af-cards-option-text');

      const text = document.createElement('p');
      text.textContent = label;

      textContainer.appendChild(text);
      elem.appendChild(textContainer);
    }

    return elem;
  },

  renderOption(
    fieldM: ICardsFieldModel,
    inputV: CardsInputView,
    option: ICardsOptionModel
  ): HTMLDivElement {
    const { config } = fieldM;

    const elem = document.createElement('div');
    elem.classList.add('af-cards-option');

    if (config.hideLabels) {
      elem.classList.add('af-cards-option-mute');
    }

    const uid = UID.create();

    const inputData = { uid, value: option.value };
    const inputE = this.renderOptionInput(fieldM, inputV, inputData);
    elem.appendChild(inputE);

    const labelE = this.renderOptionLabel(uid, option.label, config.hideLabels, option.imageUrl);
    elem.appendChild(labelE);

    return elem;
  },

  renderAllOptions(fieldM: ICardsFieldModel,
    inputV: CardsInputView): HTMLDivElement[] {
    const { options } = fieldM.config;

    const renderFn = this.renderOption.bind(this, fieldM, inputV);
    const optionsE = options.map(renderFn);

    return optionsE;
  },

  renderRoot(fieldM: ICardsFieldModel, inputV: CardsInputView): HTMLDivElement {
    const { multiple } = fieldM.config;

    const root = document.createElement('div');
    root.className = multiple ? 'af-cards-multiple' : 'af-cards';

    const options = this.renderAllOptions(fieldM, inputV);
    options.forEach(HTMLHelper.appendChild(root));

    return root;
  },
};

export type ICardsInputValue = ISingleOptionValue | IMultiOptionValue;

export type ICardsInputView = IInputView;

export class CardsInputView extends BaseInputView implements ICardsInputView {
  protected readonly multiple: boolean;

  protected readonly rootE: HTMLDivElement;

  protected readonly optionsE: HTMLInputElement[];

  protected constructor(fieldM: ICardsFieldModel) {
    super();
    this.multiple = fieldM.config.multiple;
    this.rootE = CardsInputRenderer.renderRoot(fieldM, this);
    this.optionsE = Array.from(this.rootE.querySelectorAll('input'));
  }

  public static create(fieldM: ICardsFieldModel): CardsInputView {
    return new this(fieldM);
  }

  public getFirstCards(): ISingleOptionValue {
    const checked = this.optionsE.find(InputHelper.isChecked);
    return checked ? checked.value : undefined;
  }

  public getAllCardss(): IMultiOptionValue {
    const checked = this.optionsE.filter(InputHelper.isChecked);
    return checked.map(InputHelper.getValue);
  }

  public getValue(): ICardsInputValue {
    return this.multiple ? this.getAllCardss() : this.getFirstCards();
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
