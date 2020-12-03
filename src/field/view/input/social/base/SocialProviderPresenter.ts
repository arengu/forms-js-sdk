import { AsyncButtonPresenterImpl, IAsyncButtonPresenter } from "../../../../../block/navigation/button/async/AsyncButtonPresenter";
import { IAsyncButtonView } from "../../../../../block/navigation/button/async/AsyncButtonView";
import { SocialProvider } from "../../../../../form/model/FormModel";

export interface ISocialLoginData<P extends SocialProvider = SocialProvider> {
  provider: P;
  accessToken: string;
}

export interface ISocialProviderSubscriber<P extends SocialProvider = SocialProvider> {
  onSocialLogin?(provider: ISocialProviderPresenter<P>, login: ISocialLoginData<P>, ): void;
}

export interface ISocialProviderPresenter<P extends SocialProvider = SocialProvider> extends IAsyncButtonPresenter {
  subscribe(subscriber: ISocialProviderSubscriber): void;

  getLoginData(): ISocialLoginData<P> | undefined;
  clearLoginData(): void;
}

export class SocialProviderPresenterImpl<P extends SocialProvider = SocialProvider> extends AsyncButtonPresenterImpl<IAsyncButtonView> implements ISocialProviderPresenter<P> {
  protected readonly provider: P;
  
  protected readonly subscribers: ISocialProviderSubscriber<P>[];

  protected loginData?: ISocialLoginData<P>;

  public constructor(provider: P, buttonV: IAsyncButtonView) {
    super(buttonV);

    this.provider = provider;
    this.subscribers = [];
  }

  reset(): void {
    this.loginData = undefined;
    super.reset();
  }

  public subscribe(subscriber: ISocialProviderSubscriber<P>): void {
    this.subscribers.push(subscriber);
  }

  public onAccessToken(accessToken: string): void {
    const loginData = {
      provider: this.provider,
      accessToken,
    };

    this.loginData = loginData;

    this.subscribers.forEach((s) => s.onSocialLogin?.(this, loginData));
  }

  public getLoginData(): ISocialLoginData<P> | undefined {
    return this.loginData;
  }

  public clearLoginData(): void {
    this.loginData = undefined;
  }
}
