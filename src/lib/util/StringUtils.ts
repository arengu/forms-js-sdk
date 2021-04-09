import isString from 'lodash/isString';
import isNil from 'lodash/isNil';
import isFinite from 'lodash/isFinite';

export const StringUtils = {
  stringify(input: any): string { // eslint-disable-line @typescript-eslint/no-explicit-any
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

  /**
   * Alternative to future String.prototype.replaceAll
   */
  replaceAll(str: string, searchValue: string, replaceValue: string): string {
    return str.split(searchValue).join(replaceValue);
  }
};
