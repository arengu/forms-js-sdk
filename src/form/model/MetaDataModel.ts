import { URLHelper } from '../../lib/URLHelper';

export interface IMetaDataModel {
  readonly navigator: {
    readonly userAgent: string;
    readonly language: string;
  };
  readonly navigation: {
    readonly referer: string;
    readonly location: {
      readonly url: string;
      readonly protocol: string;
      readonly host: string;
      readonly path: string;
      readonly parameters: string;
    };
    readonly analytics: {
      readonly ga: {
        readonly utm_source: null | string;
        readonly utm_medium: null | string;
        readonly utm_campaign: null | string;
        readonly utm_term: null | string;
        readonly utm_content: null | string;
      };
    };
  };
  readonly view: {
    readonly screen: {
      readonly height: number;
      readonly width: number;
    };
    readonly window: {
      readonly height: number;
      readonly width: number;
    };
  };
}

export abstract class MetaDataModelFactory {
  public static create(): IMetaDataModel {
    return {
      navigator: {
        userAgent: window.navigator.userAgent,
        language: window.navigator.language,
      },
      navigation: {
        referer: document.referrer,
        location: {
          url: document.location.href,
          protocol: document.location.protocol,
          host: document.location.host,
          path: document.location.pathname,
          parameters: document.location.search,
        },
        analytics: {
          ga: {
            /* eslint-disable @typescript-eslint/camelcase */
            utm_source: URLHelper.getParam('utm_source'),
            utm_medium: URLHelper.getParam('utm_medium'),
            utm_campaign: URLHelper.getParam('utm_campaign'),
            utm_term: URLHelper.getParam('utm_term'),
            utm_content: URLHelper.getParam('utm_content'),
            /* eslint-enable @typescript-eslint/camelcase */
          },
        },
      },
      view: {
        screen: {
          height: window.screen.height,
          width: window.screen.width,
        },
        window: {
          height: window.innerHeight,
          width: window.innerWidth,
        },
      },
    };
  }
}
