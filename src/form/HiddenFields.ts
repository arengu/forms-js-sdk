import isNil from 'lodash/isNil';
import keyBy from 'lodash/keyBy';
import includes from 'lodash/includes';
import mapValues from 'lodash/mapValues';

import { SDKErrorCode } from '../error/ErrorCodes';
import { SDKError } from '../error/SDKError';
import { StringUtils } from '../lib/util/StringUtils';

const MISSING_KEY_ERROR = 'The provided key does not belong to a hidden field';

export type IHiddenFieldValue = string;

export type IHiddenFieldValues = Record<string, IHiddenFieldValue>;

export interface IHiddenFieldItem {
  readonly key: string;
  readonly value: IHiddenFieldValue;
}

export type IHiddenFieldsDef = IHiddenFieldItem[];

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

  public setValue(key: string, newValue: unknown): IHiddenFieldValue {
    if (!this.hasKey(key)) {
      throw SDKError.create(SDKErrorCode.UNDEFINED_KEY, MISSING_KEY_ERROR);
    }

    const strValue = StringUtils.stringify(newValue);

    this.fields[key] = strValue;

    return strValue;
  }

  public getAll(): IHiddenFieldValues {
    return this.fields;
  }
}
