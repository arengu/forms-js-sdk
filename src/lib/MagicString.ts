import toString from 'lodash/toString';

import { IFormData } from '../form/model/SubmissionModel';

const TOKENIZE_REGEX = /(\\?{{[a-z0-9_-}]+}})/i;

const REFERENCE_REGEX = /^{{[a-z0-9_-}]+}}$/i;

export const MagicString = {
  isDynamic(input: string): boolean {
    return TOKENIZE_REGEX.test(input);
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

  render(input: string, data: IFormData): string {
    const tokens = MagicString.tokenize(input);

    if (tokens.length === 1) {
      return input;
    }

    const parts = tokens.map((str): string => {
      if (MagicString.isVariable(str) === false) {
        return str;
      }

      const ref = MagicString.getReference(str);

      const value = toString(data[ref]);

      return value;
    });

    const output = parts.join('');

    return output;
  },
};
