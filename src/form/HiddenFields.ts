import isNil from 'lodash/isNil';
import isFinite from 'lodash/isFinite';
import isObject from 'lodash/isObject';
import keyBy from 'lodash/keyBy';
import includes from 'lodash/includes';
import mapValues from 'lodash/mapValues';

import { SDKErrorCode } from '../error/ErrorCodes';
import { SDKError } from '../error/SDKError';

const MISSING_KEY_ERROR = 'The provided key does not belong to a hidden field';

export type IHiddenFieldValue = string | undefined;

export type IHiddenFieldValues = Record<string, IHiddenFieldValue>;

export interface IHiddenFieldItem {
  readonly key: string;
  readonly value: IHiddenFieldValue;
}

export type IHiddenFieldsDef = IHiddenFieldItem[];

const HiddenFieldsHelper = {
  serialize(value: unknown): IHiddenFieldValue {
    if (isNil(value)) {
      return undefined;
    }

    if (typeof value === 'string') {
      return value;
    }

    if (typeof value === 'number') {
      return isFinite(value) ? value.toString() : undefined;
    }

    if (typeof value === 'boolean') {
      return value.toString();
    }

    return JSON.stringify(
      value,
      (_k, v) => isObject(v) ? v : HiddenFieldsHelper.serialize(v),
    );
  }
};

export class HiddenFields {
  protected readonly fields: IHiddenFieldValues;

  protected readonly keys: string[];

  protected constructor(fields: IHiddenFieldsDef) {
    this.fields = mapValues(keyBy(fields, 'key'), 'value');
    this.keys = Object.keys(this.fields);
  }

  public static create(fields: IHiddenFieldsDef): HiddenFields {
    return new HiddenFields(fields);
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

  public setValue(key: string, newValue: unknown): void {
    if (!this.hasKey(key)) {
      throw SDKError.create(SDKErrorCode.UNDEFINED_KEY, MISSING_KEY_ERROR);
    }

    this.fields[key] = HiddenFieldsHelper.serialize(newValue);
  }

  public getAll(): IHiddenFieldValues {
    return this.fields;
  }
}
