import 'url-search-params-polyfill';

export const URLHelper = {
  getParam(name: string): string | undefined {
    return new URLSearchParams(document.location.search).get(name) || undefined;
  },

  getAllParams(): Record<string, string | string[]> {
    const entries = new URLSearchParams(document.location.search);
    const params: Record<string, string | string[]> = {};

    entries.forEach((newVal, key): void => {
      const currVal = params[key];

      if (currVal == undefined) { // eslint-disable-line eqeqeq
        params[key] = newVal;
      } else if (typeof (currVal) === 'string') {
        params[key] = [currVal, newVal] as string[];
      } else if (currVal instanceof Array) {
        params[key] = currVal.concat(newVal);
      } else {
        throw new Error('Unexpected value');
      }
    });

    return params;
  },
};
