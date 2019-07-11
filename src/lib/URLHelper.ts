import 'url-search-params-polyfill';

export abstract class URLHelper {
  public static getParam(name: string): null | string {
    return new URLSearchParams(document.location.search).get(name);
  }
}
