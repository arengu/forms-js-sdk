import identity from 'lodash/identity';
import getValue from 'lodash/get';

import { IRefScope } from '../form/model/FormModel';
import { IEscapeFunction } from './MagicResolver';
import { StringUtils } from './util/StringUtils';

const TOKENIZE_REGEX = /({{\s*[a-z0-9_-]+(?:\.[a-z0-9_-]+)*\s*}})/i;
const REFERENCE_REGEX = /^({{\s*[a-z0-9_-]+(?:\.[a-z0-9_-]+)*\s*}})$/i;

export const RefResolver = {
  tokenize(input: string): string[] {
    return input.split(TOKENIZE_REGEX);
  },

  isVariable(input: string): boolean {
    return REFERENCE_REGEX.test(input);
  },

  getReference(input: string): string {
    return input.slice(2, -2).trim();
  },

  resolve(input: string, scope: IRefScope, escape: IEscapeFunction = identity): string {
    const tokens = RefResolver.tokenize(input);

    if (tokens.length === 1) {
      return input;
    }

    const parts = tokens.map((str): string => {
      if (RefResolver.isVariable(str) === false) {
        return str;
      }

      const ref = RefResolver.getReference(str);

      const rawValue = getValue(scope, ref);
      const strValue = StringUtils.stringify(rawValue);
      const escValue = escape(strValue);

      return escValue;
    });

    const output = parts.join('');

    return output;
  },
};
