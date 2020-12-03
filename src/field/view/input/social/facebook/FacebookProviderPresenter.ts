import { SocialProviderPresenterImpl, ISocialProviderPresenter } from "../base/SocialProviderPresenter";

import { SocialProvider, IFacebookSocialConfig } from "../../../../../form/model/FormModel";
import { IFacebookSDK, FacebookSDK } from "../../../../../deps/FacebookSDK";
import { FacebookProviderView } from "./FacebookProviderView";
import { IAsyncButtonView } from "../../../../../block/navigation/button/async/AsyncButtonView";
import { IButtonViewSubscriber } from "../../../../../block/navigation/button/base/ButtonView";

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

type IFacebookResponse = IFacebookIgnorableResponse | IFacebookConnectedResponse;

export class FacebookProviderPresenterImpl extends SocialProviderPresenterImpl<SocialProvider.FACEBOOK> implements ISocialProviderPresenter, IButtonViewSubscriber {
  protected readonly config: IFacebookSocialConfig;
  
  protected _enabled: boolean;

  protected sdk?: IFacebookSDK;

  public constructor(view: IAsyncButtonView, config: IFacebookSocialConfig) {
    super(SocialProvider.FACEBOOK, view);

    view.subscribe(this);
    
    this.config = config;

    this._enabled = true; // init status

    this.disable(); // disabled until SDK is init
    FacebookSDK.initSDK(config.clientId, (sdk: IFacebookSDK) => this.onInit(sdk));
  }

  public disable(): void {
    this._enabled = false;
    this.buttonV.block();
  }

  public enable(): void {
    if (this.sdk) {
      this._enabled = true;
      this.buttonV.unblock();
    }
  }

  public onInit(sdk: IFacebookSDK): void {
    this.sdk = sdk;
    this.enable();
  }

  public onClick(): void {
    this.sdk?.getLoginStatus((res: IFacebookResponse) => this.handleStatus(res));
  }

  public requestLogin(): void {
    this.sdk?.login(
      (res: IFacebookResponse) => this.handleLogin(res),
      { scope: this.config.scopes.join(',') },
    );
  }

  public handleStatus(res: IFacebookResponse): void {
    if (res.status === ResponseStatus.CONNECTED) {
      const { accessToken } = res.authResponse;
      this.onAccessToken(accessToken);
    } else {
      this.requestLogin();
    }
  }

  public handleLogin(res: IFacebookResponse): void {
    if (res.status === ResponseStatus.CONNECTED) {
      const { accessToken } = res.authResponse;
      this.onAccessToken(accessToken);
    }
  }
}

export const FacebookProviderPresenter = {
  create(config: IFacebookSocialConfig): ISocialProviderPresenter {
    return new FacebookProviderPresenterImpl(
      FacebookProviderView.create(config.text),
      config,
    );
  }
}
