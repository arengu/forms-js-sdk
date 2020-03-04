import { GenericButtonView, ButtonType } from "../../../../block/navigation/GenericButtonView";
import { ISocialButtonListener, ISocialButtonView } from "../SocialInputView";
import { SocialProvider, IFacebookSocialConfig } from "../../../../form/model/FormModel";
import { IFacebookSDK, FacebookSDK } from "../../../../deps/FacebookSDK";

const CSS_CLASSES: string[] = ['af-social-facebook'];

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

export class FacebookButtonView extends GenericButtonView implements ISocialButtonView {
  protected readonly buttonL: ISocialButtonListener;

  protected readonly config: IFacebookSocialConfig;

  protected sdk?: IFacebookSDK;

  protected constructor(fbC: IFacebookSocialConfig, buttonL: ISocialButtonListener) {
    super({
      text: fbC.button,
      type: ButtonType.BUTTON,
      callback: () => this.onClick(),
      containerClasses: CSS_CLASSES,
    });

    this.config = fbC;

    this.unblock();

    FacebookSDK.initSDK(fbC.clientId, (sdk: IFacebookSDK) => this.onInit(sdk));

    this.buttonL = buttonL;
  }

  getProvider(): SocialProvider {
    return SocialProvider.FACEBOOK;
  }

  public onInit(sdk: IFacebookSDK): void {
    this.sdk = sdk;
    this.unblock();
  }

  public onClick(): void {
    this.sdk && this.sdk.getLoginStatus((res: IFacebookResponse) => this.handleStatus(res));
  }

  public requestLogin(): void {
    this.sdk && this.sdk.login(
      (res: IFacebookResponse) => this.handleLogin(res),
      { scope: this.config.scopes.join(',') },
    );
  }

  public handleStatus(res: IFacebookResponse): void {
    if (res.status === ResponseStatus.CONNECTED) {
      const { accessToken } = res.authResponse;
      this.buttonL.onAccessToken(accessToken, this);
    } else {
      this.requestLogin();
    }
  }

  public reset(): void {
    if (this.sdk) { // if SDK is not init, we do not have to reset anything
      super.reset();
    }
  }

  public handleLogin(res: IFacebookResponse): void {
    if (res.status === ResponseStatus.CONNECTED) {
      const { accessToken } = res.authResponse;
      this.buttonL.onAccessToken(accessToken, this);
    }
  }

  public static create(fbC: IFacebookSocialConfig, buttonL: ISocialButtonListener): ISocialButtonView {
    return new FacebookButtonView(fbC, buttonL);
  }
}