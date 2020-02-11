import includes from 'lodash/includes';
import isNil from 'lodash/isNil';

import {
  IInputView, IInputViewListener, ISingleOptionValue, IMultiOptionValue,
} from '../InputView';
import { HTMLHelper } from '../../../lib/view/HTMLHelper';
import { UID } from '../../../lib/UID';
import { InputConfigurator, InputHelper } from './InputHelper';
import { IFieldOptionModel, IChoiceFieldModel } from '../../model/FieldModel';

export enum ChoiceInputType {
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

export abstract class ChoiceInputRenderer {
  public static isDefault(fieldM: IChoiceFieldModel, value: string): boolean {
    const { defaultValue, multiple } = fieldM.config;

    return !isNil(defaultValue)
      && (
        multiple
          ? includes(defaultValue, value)
          : defaultValue === value
      );
  }

  public static renderOptionInput(fieldM: IChoiceFieldModel, inputL: IInputViewListener,
    inputData: IOptionInputData): HTMLInputElement {
    const { multiple } = fieldM.config;

    const inputType = multiple ? ChoiceInputType.Multiple : ChoiceInputType.Single;
    const node = document.createElement('input');
    node.type = inputType;

    node.id = inputData.uid;
    node.name = fieldM.id;
    node.value = inputData.value;

    if (this.isDefault(fieldM, inputData.value)) {
      node.setAttribute('checked', 'checked');
    }

    InputConfigurator.addListeners(node, inputL);

    return node;
  }

  public static renderOptionLabel(uid: string, label: string): HTMLLabelElement {
    const elem = document.createElement('label');
    elem.setAttribute('for', uid);

    const span = document.createElement('span');
    span.textContent = label;

    elem.appendChild(span);

    return elem;
  }

  public static renderOption(fieldM: IChoiceFieldModel, inputL: IInputViewListener,
    option: IFieldOptionModel): HTMLDivElement {
    const elem = document.createElement('div');
    elem.classList.add('af-choice-option');

    const uid = UID.create();

    const inputData = { uid, value: option.value };
    const inputE = this.renderOptionInput(fieldM, inputL, inputData);
    elem.appendChild(inputE);

    const labelE = this.renderOptionLabel(uid, option.label);
    elem.appendChild(labelE);

    return elem;
  }

  public static renderAllOptions(fieldM: IChoiceFieldModel,
    inputL: IInputViewListener): HTMLDivElement[] {
    const { options } = fieldM.config;

    const renderFn = this.renderOption.bind(this, fieldM, inputL);
    const optionsE = options.map(renderFn);

    return optionsE;
  }

  public static renderRoot(fieldM: IChoiceFieldModel, inputL: IInputViewListener): HTMLDivElement {
    const { multiple } = fieldM.config;

    const root = document.createElement('div');
    root.className = multiple ? 'af-choice-multiple' : 'af-choice';

    const options = this.renderAllOptions(fieldM, inputL);
    options.forEach(HTMLHelper.appendChild(root));

    return root;
  }
}

export type IChoiceInputValue = ISingleOptionValue | IMultiOptionValue;

export type IChoiceInputView = IInputView<IChoiceInputValue>;

export class ChoiceInputView implements IChoiceInputView {
  protected readonly multiple: boolean;

  protected readonly rootE: HTMLDivElement;

  protected readonly optionsE: HTMLInputElement[];

  protected constructor(fieldM: IChoiceFieldModel, inputL: IInputViewListener) {
    this.multiple = fieldM.config.multiple;
    this.rootE = ChoiceInputRenderer.renderRoot(fieldM, inputL);
    this.optionsE = Array.from(this.rootE.querySelectorAll('input'));
  }

  public static create(fieldM: IChoiceFieldModel, inputL: IInputViewListener): ChoiceInputView {
    return new this(fieldM, inputL);
  }

  public getFirstChoice(): ISingleOptionValue {
    const checked = this.optionsE.find(InputHelper.isChecked);
    return checked ? checked.value : undefined;
  }

  public getAllChoices(): IMultiOptionValue {
    const checked = this.optionsE.filter(InputHelper.isChecked);
    return checked.map(InputHelper.getValue);
  }

  public async getValue(): Promise<IChoiceInputValue> {
    return this.multiple ? this.getAllChoices() : this.getFirstChoice();
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
