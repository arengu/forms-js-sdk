import { IInputViewListener } from '../InputView';
import { IFieldModel } from '../../model/FieldModel';

export abstract class InputHelper {
  public static isChecked(elem: HTMLInputElement): boolean {
    return elem.checked;
  }

  public static getValue(elem: HTMLInputElement): string {
    return elem.value;
  }

  public static resetCheck(elem: HTMLInputElement): void {
    elem.checked = elem.defaultChecked; // eslint-disable-line no-param-reassign
  }

  public static resetValue(elem: HTMLInputElement): void {
    elem.value = elem.defaultValue; // eslint-disable-line no-param-reassign
  }
}

export abstract class InputCreator {
  public static input(fieldM: IFieldModel, uid: string, inputType: string): HTMLInputElement {
    const elem = document.createElement('input');

    elem.type = inputType;
    elem.id = uid;
    elem.name = fieldM.id;

    return elem;
  }

  public static textarea(fieldM: IFieldModel, uid: string): HTMLTextAreaElement {
    const elem = document.createElement('textarea');

    elem.id = uid;
    elem.name = fieldM.id;

    return elem;
  }
}

export type ITextInput = HTMLInputElement | HTMLTextAreaElement;

export interface IFieldWithPlaceholder {
  readonly placeholder: null | string;
}
export interface IFieldWithDefaultValue {
  readonly config: {
    readonly defaultValue: null | number | string;
  };
}
export interface IFieldWithLengthRules {
  readonly config: {
    readonly minLength: number;
    readonly maxLength: null | number;
  };
}
export interface IFieldWithRangeRules {
  config: {
    minValue: null | number;
    maxValue: null | number;
  };
}

export abstract class InputConfigurator {
  public static placeholder(elem: ITextInput, fieldM: IFieldWithPlaceholder): void {
    const { placeholder } = fieldM;

    if (placeholder) {
      elem.placeholder = placeholder; // eslint-disable-line no-param-reassign
    }
  }

  public static defaultValue(elem: ITextInput, fieldM: IFieldWithDefaultValue): void {
    const { defaultValue } = fieldM.config;

    if (defaultValue != null) { // explicit abstract comparison
      elem.value = defaultValue.toString(); // eslint-disable-line no-param-reassign
    }
  }

  public static lengthRules(elem: ITextInput, fieldM: IFieldWithLengthRules): void {
    const { minLength, maxLength } = fieldM.config;

    if (minLength > 0) {
      elem.minLength = minLength; // eslint-disable-line no-param-reassign
    }
    if (maxLength != null && maxLength >= 0) { // explicit abstract comparison
      elem.maxLength = maxLength; // eslint-disable-line no-param-reassign
    }
  }

  public static rangeRules(elem: HTMLInputElement, fieldM: IFieldWithRangeRules): void {
    const { minValue, maxValue } = fieldM.config;

    if (minValue != null) { // explicit abstract comparison
      elem.min = minValue.toString(); // eslint-disable-line no-param-reassign
    }
    if (maxValue != null) { // explicit abstract comparison
      elem.max = maxValue.toString(); // eslint-disable-line no-param-reassign
    }
  }

  /*
   * Old browsers do not support onInput event when input type is radio or checkbox,
   * so we have to check it and use a different event when needed.
   */
  public static supportsOnInput(elem: ITextInput): boolean {
    return elem.type !== 'radio' && elem.type !== 'checkbox';
  }

  public static addListeners(elem: ITextInput, inputL: IInputViewListener): void {
    elem.addEventListener('blur', inputL.onBlur.bind(inputL));
    elem.addEventListener('change', inputL.onChange.bind(inputL));
    elem.addEventListener('focus', inputL.onFocus.bind(inputL));
    elem.addEventListener(
      this.supportsOnInput(elem) ? 'input' : 'change',
      inputL.onInput.bind(inputL),
    );
  }
}
