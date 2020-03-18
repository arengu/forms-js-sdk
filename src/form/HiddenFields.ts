import isNil from 'lodash/isNil';
import keyBy from 'lodash/keyBy';
import includes from 'lodash/includes';
import mapValues from 'lodash/mapValues';
import toString from 'lodash/toString';

import { SDKErrorCode } from '../error/ErrorCodes';
import { SDKError } from '../error/SDKError';
import { URLHelper } from '../lib/URLHelper';

const MISSING_KEY_ERROR = 'The provided key does not belong to a hidden field';

export type IHiddenFieldValue = string | undefined;

export type IHiddenFieldValuesSet = Record<string, IHiddenFieldValue>;

export interface IHiddenFieldDef {
  readonly key: string;
  readonly value: IHiddenFieldValue;
}

export interface IHiddenFields {
  readonly [key: string]: IHiddenFieldValue;
}

export interface IValueResolver {
  (defValue: IHiddenFieldValue, fieldId: string): IHiddenFieldValue;
}

export const HiddenFieldsHelper = {
  createValueResolver(
    initValues?: IHiddenFieldValuesSet,
  ): IValueResolver {
    return function valueResolver(
      defValue: IHiddenFieldValue, fieldId: string,
    ): IHiddenFieldValue {
      const customValue = initValues ? toString(initValues[fieldId]) : undefined;
      return customValue || URLHelper.getParam(fieldId) || defValue || undefined;
    };
  },

  initFields(defs: IHiddenFieldDef[],
    initValues?: IHiddenFieldValuesSet): IHiddenFieldValuesSet {
    const index = keyBy(defs, 'key');
    const defaults = mapValues(index, 'value');

    const fields = mapValues(defaults, HiddenFieldsHelper.createValueResolver(initValues));

    return fields;
  },
};

export class HiddenFields {
  protected readonly fields: IHiddenFieldValuesSet;

  protected readonly keys: string[];

  protected constructor(fields: IHiddenFieldDef[], initValues?: IHiddenFieldValuesSet) {
    this.fields = HiddenFieldsHelper.initFields(fields, initValues);
    this.keys = Object.keys(this.fields);
  }

  public static create(fields: IHiddenFieldDef[],
    initValues?: IHiddenFieldValuesSet): HiddenFields {
    return new HiddenFields(fields, initValues);
  }

  public hasKey(key: string): boolean {
    return includes(this.keys, key);
  }

  public getValue(key: string): IHiddenFieldValue {
    const value = this.fields[key];

    if (isNil(value) && !this.hasKey(key)) {
      throw SDKError.create(SDKErrorCode.UNDEFINED_KEY, MISSING_KEY_ERROR);
    }

    return value;
  }

  public setValue(key: string, newValue: IHiddenFieldValue): void {
    if (!this.hasKey(key)) {
      throw SDKError.create(SDKErrorCode.UNDEFINED_KEY, MISSING_KEY_ERROR);
    }

    this.fields[key] = newValue;
  }

  public getAll(): IHiddenFieldValuesSet {
    return this.fields;
  }
}
