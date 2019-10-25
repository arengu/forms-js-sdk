import keyBy from 'lodash/keyBy';
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

export abstract class HiddenFieldsHelper {
  public static createValueResolver(
    initValues?: IHiddenFieldValuesSet,
  ): IValueResolver {
    return function valueResolver(
      defValue: IHiddenFieldValue, fieldId: string,
    ): IHiddenFieldValue {
      const customValue = initValues ? toString(initValues[fieldId]) : undefined;
      return customValue || URLHelper.getParam(fieldId) || defValue || undefined;
    };
  }

  public static initFields(defs: IHiddenFieldDef[],
    initValues?: IHiddenFieldValuesSet): IHiddenFieldValuesSet {
    const index = keyBy(defs, 'key');
    const defaults = mapValues(index, 'value');

    const fields = mapValues(defaults, HiddenFieldsHelper.createValueResolver(initValues));

    return fields;
  }
}

export class HiddenFields {
  protected readonly fields: IHiddenFieldValuesSet;

  protected constructor(fields: IHiddenFieldDef[], initValues?: Record<string, string>) {
    this.fields = HiddenFieldsHelper.initFields(fields, initValues);
  }

  public static create(fields: IHiddenFieldDef[],
    initValues?: Record<string, string>): HiddenFields {
    return new HiddenFields(fields, initValues);
  }

  public get(key: string): string | undefined {
    const value = this.fields[key];
    if (value == undefined) { // eslint-disable-line eqeqeq
      throw SDKError.create(SDKErrorCode.UNDEFINED_KEY, MISSING_KEY_ERROR);
    }

    return value;
  }

  public set(key: string, newValue: string | undefined): void {
    const oldValue = this.fields[key];
    if (oldValue == undefined) { // eslint-disable-line eqeqeq
      throw SDKError.create(SDKErrorCode.UNDEFINED_KEY, MISSING_KEY_ERROR);
    }

    this.fields[key] = newValue;
  }

  public getAll(): IHiddenFieldValuesSet {
    return this.fields;
  }
}
