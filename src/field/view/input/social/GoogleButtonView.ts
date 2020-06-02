import { GenericButtonView, ButtonType, ButtonStatus } from "../../../../block/navigation/GenericButtonView";
import { ISocialButtonListener, ISocialButtonView } from "../SocialInputView";
import { SocialProvider, IGoogleSocialConfig } from "../../../../form/model/FormModel";
import { IGoogleSDK, GoogleSDK, IGoogleUser } from "../../../../deps/GoogleSDK";

const CSS_CLASSES: string[] = ['af-social-provider', 'af-social-google'];

export class GoogleButtonView extends GenericButtonView implements ISocialButtonView {
  protected readonly buttonL: ISocialButtonListener;

  protected readonly config: IGoogleSocialConfig;

  protected sdk?: IGoogleSDK;

  protected constructor(config: IGoogleSocialConfig, buttonL: ISocialButtonListener) {
    super({
      text: config.text,
      type: ButtonType.BUTTON,
      callback: () => this.onClick(),
      containerClasses: CSS_CLASSES,
      initStatus: ButtonStatus.DISABLED,
    });

    this.config = config;

    GoogleSDK.initSDK(config.clientId, (sdk: IGoogleSDK) => this.onInit(sdk));

    this.buttonL = buttonL;
  }

  getProvider(): SocialProvider {
    return SocialProvider.GOOGLE;
  }

  public onInit(sdk: IGoogleSDK): void {
    this.sdk = sdk;
    this.unblock();
  }

  public onClick(): void {
    if (!this.sdk) {
      return;
    }

    const user = this.sdk.currentUser.get();

    if (user.isSignedIn()) {
      this.handleLogin(user, this.buttonL);
    } else {
      this.requestLogin()
    }
  }

  public requestLogin(): void {
    this.sdk && this.sdk
      .signIn({
        scope: this.config.scopes.join(' '),
        prompt: 'select_account',
      })
      .then((user) => this.handleLogin(user, this.buttonL))
      .catch(() => { /* pass */ });
  }

  public handleLogin(user: IGoogleUser, buttonListener: ISocialButtonListener): void {
    const authResponse = user.getAuthResponse(true);

    buttonListener.onAccessToken(authResponse.id_token, this);
  }

  public reset(): void {
    if (this.sdk) { // if SDK is not init, we do not have to reset anything
      super.reset();
    }
  }

  public static create(config: IGoogleSocialConfig, buttonL: ISocialButtonListener): ISocialButtonView {
    return new GoogleButtonView(config, buttonL);
  }
}
