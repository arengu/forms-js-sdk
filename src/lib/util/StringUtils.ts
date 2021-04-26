import isNil from 'lodash/isNil';
import isFinite from 'lodash/isFinite';
import isObject from 'lodash/isObject';

export const StringUtils = {
  stringify<T>(input: unknown, fallback: T): string | T {
    if (isNil(input)) {
      return fallback;
    }

    if (typeof input === 'string') {
      return input;
    }

    if (typeof input === 'boolean') {
      return input.toString();
    }

    if (typeof input === 'number') {
      return isFinite(input) ? input.toString() : fallback;
    }

    return JSON.stringify(
      input,
      (_k, v) => isObject(v) ? v : StringUtils.stringify(v, fallback),
    );
  },

  /**
   * Alternative to future String.prototype.replaceAll
   */
  replaceAll(str: string, searchValue: string, replaceValue: string): string {
    return str.split(searchValue).join(replaceValue);
  }
};
