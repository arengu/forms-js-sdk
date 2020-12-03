import { AsyncButtonPresenterImpl, IAsyncButtonPresenter } from "../../../../../block/navigation/button/async/AsyncButtonPresenter";
import { IAsyncButtonView } from "../../../../../block/navigation/button/async/AsyncButtonView";
import { IButtonViewSubscriber } from "../../../../../block/navigation/button/base/ButtonView";
import { SocialProvider } from "../../../../../form/model/FormModel";

export interface ISocialLoginData<P extends SocialProvider = SocialProvider> {
  provider: P;
  accessToken: string;
}

export interface ISocialButtonViewSubscriber<P extends SocialProvider> extends IButtonViewSubscriber {
  onSocialLogin?(login: ISocialLoginData<P>): void;
}

export interface ISocialProviderSubscriber<P extends SocialProvider = SocialProvider> {
  onSocialLogin?(login: ISocialLoginData<P>): void;
}

export interface ISocialProviderPresenter<P extends SocialProvider = SocialProvider> extends IAsyncButtonPresenter {
  getProvider(): SocialProvider;
  getLoginData(): ISocialLoginData<P> | undefined;
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

  getProvider(): SocialProvider {
    return this.provider;
  }

  reset(): void {
    this.loginData = undefined;
    super.reset();
  }

  public subscribe(subscriber: ISocialProviderSubscriber<P>): void {
    this.subscribers.push(subscriber);
  }

  public onAccessToken(accessToken: string): void {
    const loginData: ISocialLoginData<P> = {
      provider: this.provider,
      accessToken,
    };

    this.subscribers.forEach((s) => s.onSocialLogin?.(loginData));
  }

  public getLoginData(): ISocialLoginData<P> | undefined {
    return this.loginData;
  }
}
