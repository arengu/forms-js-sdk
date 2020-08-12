import getValue from 'lodash/get';
import identity from 'lodash/identity';

import { IRefsScope } from '../form/model/FormModel';
import { StringUtils } from './util/StringUtils';

const TOKENIZE_REGEX = /({{[a-z0-9_-]+(?:\.[a-z0-9_-]+)*}})/i;

const REFERENCE_REGEX = /^({{[a-z0-9_-]+(?:\.[a-z0-9_-]+)*}})$/i;

export interface IEscapeFunction {
  (str: string): string;
}

export const MagicString = {
  isDynamic(input: string | undefined): boolean {
    return typeof input === 'string' && TOKENIZE_REGEX.test(input);
  },

  tokenize(input: string): string[] {
    return input.split(TOKENIZE_REGEX);
  },

  isVariable(input: string): boolean {
    return REFERENCE_REGEX.test(input);
  },

  getReference(input: string): string {
    return input.slice(2, -2);
  },

  render(input: string, data: IRefsScope, escape: IEscapeFunction = identity): string {
    const tokens = MagicString.tokenize(input);

    if (tokens.length === 1) {
      return input;
    }

    const parts = tokens.map((str): string => {
      if (MagicString.isVariable(str) === false) {
        return str;
      }

      const ref = MagicString.getReference(str);

      const rawValue = getValue(data, ref);
      const strValue = StringUtils.stringify(rawValue);
      const escValue = escape(strValue);

      return escValue;
    });

    const output = parts.join('');

    return output;
  },
};
