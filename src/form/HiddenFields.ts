import keyBy from 'lodash/keyBy';
import mapValues from 'lodash/mapValues';
import toString from 'lodash/toString';

import { SDKErrorCode } from '../error/ErrorCodes';
import { SDKError } from '../error/SDKError';
import { URLHelper } from '../lib/URLHelper';

const MISSING_KEY_ERROR = 'The provided key does not belong to a hidden field';

export type IHiddenFieldValue = null | string;

export interface IHiddenFieldDef {
  readonly key: string;
  readonly value: IHiddenFieldValue;
}

export interface IHiddenFields {
  readonly [key: string]: IHiddenFieldValue;
}

export interface IValueResolver {
  (defValue: string | null, fieldId: string): null | string;
}

export abstract class HiddenFieldsHelper {
  public static createValueResolver(initValues?: Record<string, null | string>): IValueResolver {
    return function valueResolver(defValue: null | string, fieldId: string): null | string {
      const customValue = initValues ? toString(initValues[fieldId]) : null;
      return customValue || URLHelper.getParam(fieldId) || defValue || null;
    };
  }

  public static initFields(defs: IHiddenFieldDef[],
    initValues?: Record<string, null | string>): Record<string, null | string> {
    const index = keyBy(defs, 'key');
    const defaults = mapValues(index, 'value');

    const fields = mapValues(defaults, HiddenFieldsHelper.createValueResolver(initValues));

    return fields;
  }
}

export class HiddenFields {
  protected readonly fields: Record<string, null | string>;

  protected constructor(fields: IHiddenFieldDef[], initValues?: Record<string, string>) {
    this.fields = HiddenFieldsHelper.initFields(fields, initValues);
  }

  public static create(fields: IHiddenFieldDef[],
    initValues?: Record<string, string>): HiddenFields {
    return new HiddenFields(fields, initValues);
  }

  public get(key: string): null | string {
    const value = this.fields[key];
    if (value === undefined) {
      throw SDKError.create(SDKErrorCode.UNDEFINED_KEY, MISSING_KEY_ERROR);
    }

    return value;
  }

  public set(key: string, newValue: null | string): void {
    const oldValue = this.fields[key];
    if (oldValue === undefined) {
      throw SDKError.create(SDKErrorCode.UNDEFINED_KEY, MISSING_KEY_ERROR);
    }

    this.fields[key] = newValue;
  }

  public getAll(): Record<string, null | string> {
    return this.fields;
  }
}
