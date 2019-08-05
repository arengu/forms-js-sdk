import 'url-search-params-polyfill';

export const URLHelper = {
  getParam(name: string): null | string {
    return new URLSearchParams(document.location.search).get(name);
  },

  getAllParams(): Record<string, string | string[]> {
    const entries = new URLSearchParams(document.location.search);
    const params: Record<string, string | string[]> = {};

    entries.forEach((newVal, key): void => {
      const currVal = params[key];

      if (currVal == null) {
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
