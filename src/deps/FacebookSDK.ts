interface IFacebookInitParams {
  readonly appId: string;
  readonly version: string;
}

interface IFacebookLoginParams {
  readonly scope: string;
}

interface IAsyncResponse<T> {
  (data: T): void;
}

enum ResponseStatus {
  CONNECTED = 'connected',
  NOT_AUTHORIZED = 'not_authorized',
  UNKNOWN = 'unknown',
}

interface IFacebookIgnorableResponse {
  readonly status: ResponseStatus.NOT_AUTHORIZED | ResponseStatus.UNKNOWN;
}

interface IFacebookConnectedResponse {
  readonly status: ResponseStatus.CONNECTED;
  readonly authResponse: {
    readonly accessToken: string;
  };
}

export type IFacebookLoginResponse = IFacebookIgnorableResponse | IFacebookConnectedResponse;

export interface IFacebookSDK {
  getLoginStatus(cb: IAsyncResponse<IFacebookLoginResponse>): void;
  login(cb: IAsyncResponse<IFacebookLoginResponse>, params: IFacebookLoginParams): void;
  init(params: IFacebookInitParams): void;
}

declare const FB: IFacebookSDK;

declare const window: {
  FB?: IFacebookSDK;
  fbAsyncInit?: () => void;
};

interface IFacebookSDKListener {
  (sdk: IFacebookSDK): void;
}

export const FacebookSDK = {
  initSDK(clientId: string, callback: IFacebookSDKListener): void {
    if (window.FB) {
      callback(window.FB);
      return;
    }

    const currInit = window.fbAsyncInit;

    if (currInit) {
      window.fbAsyncInit = function fbInit(): void {
        currInit();

        callback(FB);
      }
      return;
    }

    window.fbAsyncInit = function fbInit(): void {
      FB.init({
        appId: clientId,
        version: 'v6.0',
      });

      callback(FB);
    }

    const parent = document.querySelector('body');

    if (parent) {
      const node = document.createElement('script');
      node.type = 'text/javascript';
      node.src = 'https://connect.facebook.net/en_US/sdk.js';

      parent.appendChild(node);
    }
  }
};
