import { URLHelper } from '../../lib/URLHelper';

export interface IMetaDataModel {
  readonly navigator: {
    readonly userAgent: string;
    readonly language: string;
  };
  readonly navigation: {
    readonly referer: string;
    readonly location: {
      readonly protocol: string;
      readonly hostname: string;
      readonly port: string;
      readonly host: string;
      readonly pathname: string;
      readonly search: string;
      readonly searchParams: Record<string, string | string[]>;
      readonly hash: string;
      readonly href: string;
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
          protocol: document.location.protocol,
          hostname: document.location.hostname,
          port: document.location.port,
          host: document.location.host,
          pathname: document.location.pathname,
          search: document.location.search,
          searchParams: URLHelper.getAllParams(),
          hash: document.location.hash,
          href: document.location.href,
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
