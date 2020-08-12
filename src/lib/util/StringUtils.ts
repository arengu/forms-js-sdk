import isString from 'lodash/isString';
import isNil from 'lodash/isNil';
import isFinite from 'lodash/isFinite';

export const StringUtils = {
  stringify(input: string | null | number | object): string {
    if (isString(input)) {
      return input;
    }

    if (isNil(input)) {
      return '';
    }

    if (isFinite(input)) {
      return input.toString();
    }

    return JSON.stringify(input);
  },
};
