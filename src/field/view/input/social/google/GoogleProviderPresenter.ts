import { SocialProviderPresenterImpl, ISocialProviderPresenter } from "../base/SocialProviderPresenter";

import { SocialProvider, IGoogleSocialConfig } from "../../../../../form/model/FormModel";
import { IAsyncButtonView } from "../../../../../block/navigation/button/async/AsyncButtonView";
import { GoogleSDK, IGoogleSDK, IGoogleUser } from "../../../../../deps/GoogleSDK";
import { IButtonViewSubscriber } from "../../../../../block/navigation/button/base/ButtonView";
import { GoogleProviderView } from "./GoogleProviderView";

export class GoogleProviderPresenterImpl extends SocialProviderPresenterImpl<SocialProvider.GOOGLE> implements ISocialProviderPresenter, IButtonViewSubscriber {
  protected readonly config: IGoogleSocialConfig;
  
  protected _enabled: boolean;

  protected sdk?: IGoogleSDK;

  public constructor(view: IAsyncButtonView, config: IGoogleSocialConfig) {
    super(SocialProvider.GOOGLE, view);

    view.subscribe(this);
    
    this.config = config;

    this._enabled = false;

    this.disable(); // disabled until SDK is init
    GoogleSDK.initSDK(config.clientId, (sdk: IGoogleSDK) => this.onInit(sdk));
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

  public onInit(sdk: IGoogleSDK): void {
    this.sdk = sdk;
    this.enable();
  }

  public onClick(): void {
    this.requestLogin();
  }

  public requestLogin(): void {
    this.sdk
      ?.signIn({
        scope: this.config.scopes.join(' '),
        prompt: 'select_account',
      })
      .then((user) => this.handleLogin(user))
      .catch(() => { /* pass */ });
  }

  public handleLogin(user: IGoogleUser): void {
    const authResponse = user.getAuthResponse(true);

    this.onAccessToken(authResponse.id_token);
  }
}

export const GoogleProviderPresenter = {
  create(config: IGoogleSocialConfig): ISocialProviderPresenter {
    return new GoogleProviderPresenterImpl(
      GoogleProviderView.create(config.text),
      config,
    );
  }
}
