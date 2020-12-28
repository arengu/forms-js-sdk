interface IGoogleInitParams {
  readonly client_id: string;
}

export interface IGoogleAuthResponse {
  readonly id_token: string;
}

export interface IGoogleUser {
  isSignedIn(): boolean;
  getAuthResponse(includeAuthorizationData?: boolean): IGoogleAuthResponse;
}

export interface IGoogleSignInParams {
  readonly scope: string;
  readonly prompt: string;
}

export interface IGoogleSDK {
  signIn(options: IGoogleSignInParams): Promise<IGoogleUser>;
  currentUser: { get(): IGoogleUser };
}

declare const window: {
  _arenguGoogleInit?: () => void;
};

interface IGoogleSDKListener {
  (sdk: IGoogleSDK): void;
}

interface IGooglePlatformApi {
  load(module: string, callback: () => void): void;
  auth2: {
    init(params: IGoogleInitParams): Promise<IGoogleSDK>;
  };
}

declare const gapi: IGooglePlatformApi;

let GoogleAuth: IGoogleSDK;

const callbacks: IGoogleSDKListener[] = [];

export const GoogleSDK = {
  initSDK(clientId: string, callback: IGoogleSDKListener): void {
    if (GoogleAuth) {
      callback(GoogleAuth);
      return;
    }

    callbacks.push(callback);

    if (window._arenguGoogleInit) {
      return;
    }

    window._arenguGoogleInit = function init(): void {
      gapi.load('auth2', () => {
        gapi.auth2
          .init({ client_id: clientId }) // eslint-disable-line @typescript-eslint/camelcase
          .then((auth2) => {
            GoogleAuth = auth2;

            callbacks.forEach((cb) => cb(GoogleAuth))
          });
      });
    }

    const node = document.createElement('script');
    node.type = 'text/javascript';
    node.src = 'https://apis.google.com/js/platform.js?onload=_arenguGoogleInit';

    document.body.appendChild(node);
  }
};
