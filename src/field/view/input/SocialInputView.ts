import { SocialProvider } from '../../../form/model/FormModel';
import { IInputView, IInputViewListener } from '../InputView';
import { ButtonViewFactory } from './social/ButtonViewFactory';
import { IFormDeps } from '../../../form/FormPresenter';
import { ListenableEntity } from '../../../lib/ListenableEntity';
import { IView } from '../../../core/BaseTypes';

export type SocialInputElements = HTMLInputElement | HTMLTextAreaElement;

export interface ISocialLoginData {
  provider: SocialProvider;
  accessToken: string;
}

export type ISocialInputValue = undefined | ISocialLoginData;

export interface ISocialInputView extends IInputView {
  getValue(): ISocialInputValue;
  showLoading(): void;
  hideLoading(): void;
}

export interface ISocialInputViewListener extends IInputViewListener {
  onLogin(data: ISocialLoginData, buttonV: ISocialButtonView): void;
}

export interface ISocialButtonListener {
  onAccessToken(accessToken: string, buttonV: ISocialButtonView): void;
}

export interface ISocialButtonView extends IView {
  getProvider(): SocialProvider;
  showLoading(): void;
  hideLoading(): void;
  block(): void;
  unblock(): void;
  reset(): void;
}

export const SocialInputRenderer = {
  renderRoot(buttonsV: ISocialButtonView[]): HTMLDivElement {
    const root = document.createElement('div');
    root.className = 'af-social';

    buttonsV.forEach((bV) => root.appendChild(bV.render()));

    return root;
  },
}

export class SocialInputView extends ListenableEntity<ISocialInputViewListener> implements ISocialInputView, ISocialButtonListener {
  protected readonly rootE: HTMLDivElement;

  protected readonly buttonsV: ISocialButtonView[];
  protected usedProviderV?: ISocialButtonView;

  protected accessToken?: ISocialLoginData;

  protected visible: boolean;

  protected constructor(formD: IFormDeps) {
    super();

    this.buttonsV = formD.social.map((sC) => ButtonViewFactory.create(sC, this));

    this.rootE = SocialInputRenderer.renderRoot(this.buttonsV);

    this.visible = false;
  }

  public static create(formD: IFormDeps): ISocialInputView {
    return new SocialInputView(formD);
  }

  public reset(): void {
    this.buttonsV.forEach((bV) => bV.reset());
  }

  public onAccessToken(accessToken: string, buttonV: ISocialButtonView): void {
    if (!this.visible) {
      return;
    }

    const loginData: ISocialLoginData = {
      provider: buttonV.getProvider(),
      accessToken,
    };

    this.accessToken = loginData;
    this.usedProviderV = buttonV;

    this.listeners.forEach((listener) => listener.onLogin && listener.onLogin(loginData, buttonV));
  }

  public getValue(): ISocialInputValue {
    return this.accessToken;
  }

  public onShow(): void {
    this.visible = true;
    this.usedProviderV = undefined;
  }

  public onHide(): void {
    this.visible = false;
  }

  public showLoading(): void {
    this.usedProviderV && this.usedProviderV.showLoading();
  }

  public hideLoading(): void {
    this.usedProviderV && this.usedProviderV.hideLoading();
  }

  public render(): HTMLElement {
    return this.rootE;
  }

  public block(): void {
    this.buttonsV.forEach((bV) => bV.block());
  }

  public unblock(): void {
    this.buttonsV.forEach((bV) => bV.unblock());
  }
}
