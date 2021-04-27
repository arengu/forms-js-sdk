import isNil from 'lodash/isNil';
import isFinite from 'lodash/isFinite';
import isPlainObject from 'lodash/isPlainObject';
import isArray from 'lodash/isArray';

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

    if (typeof input === 'bigint' || typeof input === 'symbol' || typeof input === 'function') {
      return fallback;
    }

    return JSON.stringify(
      input,
      (_k, v) =>
        isPlainObject(v) || isArray(v)
          ? v // keep traversing the input
          : StringUtils.stringify(v, fallback), // handle this case ourselves before continuing
    );
  },

  /**
   * Alternative to future String.prototype.replaceAll
   */
  replaceAll(str: string, searchValue: string, replaceValue: string): string {
    return str.split(searchValue).join(replaceValue);
  }
};
