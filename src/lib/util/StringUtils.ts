import isNil from 'lodash/isNil';
import isFinite from 'lodash/isFinite';

export const StringUtils = {
  stringify(input: unknown): string {
    if (typeof input === 'string') {
      return input;
    }

    if (isNil(input)) {
      return '';
    }

    if (typeof input === 'number') {
      return isFinite(input) ? input.toString() : '';
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
