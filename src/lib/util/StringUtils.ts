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

    // https://github.com/microsoft/TypeScript/issues/18879
    const output = JSON.stringify(input) as string | undefined;

    return isNil(output) ? '' : output;
  },

  /**
   * Alternative to future String.prototype.replaceAll
   */
  replaceAll(str: string, searchValue: string, replaceValue: string): string {
    return str.split(searchValue).join(replaceValue);
  }
};
