import isNil from 'lodash/isNil';

import { IFieldModel } from '../../model/FieldModel';
import { IHTMLInputListener } from '../InputView';

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

export type IStringInputElement = HTMLInputElement | HTMLTextAreaElement;

export interface IFieldWithPlaceholder {
  readonly config: {
    readonly placeholder?: string;
  };
}
export interface IFieldWithDefaultValue {
  readonly config: {
    readonly defaultValue?: number | string;
  };
}
export interface IFieldWithLengthRules {
  readonly config: {
    readonly minLength: number;
    readonly maxLength?: number;
  };
}
export interface IFieldWithRangeRules {
  config: {
    minValue?: number;
    maxValue?: number;
  };
}

interface IListenableHTMLElement extends HTMLElement {
  readonly type: string;
}

export abstract class InputConfigurator {
  public static placeholder(elem: IStringInputElement, fieldM: IFieldWithPlaceholder): void {
    const { placeholder } = fieldM.config;

    if (placeholder) {
      elem.placeholder = placeholder; // eslint-disable-line no-param-reassign
    }
  }

  public static defaultValue(elem: IStringInputElement, fieldM: IFieldWithDefaultValue): void {
    const { defaultValue } = fieldM.config;

    if (!isNil(defaultValue)) {
      elem.value = defaultValue.toString(); // eslint-disable-line no-param-reassign
    }
  }

  public static lengthRules(elem: IStringInputElement, fieldM: IFieldWithLengthRules): void {
    const { minLength, maxLength } = fieldM.config;

    if (minLength > 0) {
      elem.minLength = minLength; // eslint-disable-line no-param-reassign
    }
    if (!isNil(maxLength) && maxLength >= 0) {
      elem.maxLength = maxLength; // eslint-disable-line no-param-reassign
    }
  }

  public static rangeRules(elem: HTMLInputElement, fieldM: IFieldWithRangeRules): void {
    const { minValue, maxValue } = fieldM.config;

    if (!isNil(minValue)) {
      elem.min = minValue.toString(); // eslint-disable-line no-param-reassign
    }
    if (!isNil(maxValue)) {
      elem.max = maxValue.toString(); // eslint-disable-line no-param-reassign
    }
  }

  /*
   * Old browsers do not support onInput event when input type is radio or checkbox,
   * so we have to check it and use a different event when needed.
   */
  public static supportsOnInput(elem: IListenableHTMLElement): boolean {
    return elem.type !== 'radio' && elem.type !== 'checkbox';
  }

  public static addListeners(elem: IListenableHTMLElement, inputL: IHTMLInputListener): void {
    elem.addEventListener('blur', () => inputL.onBlur());
    elem.addEventListener('change', () => inputL.onChange());
    elem.addEventListener('focus', () => inputL.onFocus());
    elem.addEventListener(
      this.supportsOnInput(elem) ? 'input' : 'change',
      () => inputL.onInput(),
    );
  }
}
