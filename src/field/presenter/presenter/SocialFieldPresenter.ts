import { IFormDeps } from "../../../form/FormPresenter";
import { ISocialFieldModel, ISocialFieldValue } from "../../model/FieldModel";
import { SocialInputView, ISocialInputView } from "../../view/input/SocialInputView";
import { DummyValueHandler } from "../handler/DummyValueHandler";
import { FieldValidator, IFieldValidator } from "../validator/FieldValidator";
import { IFieldPresenter } from "./FieldPresenter";
import { BaseFieldPresenter } from "./BaseFieldPresenter";
import { IValueHandler } from "../handler/ValueHandler";
import { IComponentPresenter } from "../../../component/ComponentPresenter";
import { SocialProviderFactory } from "../../view/input/social/SocialProviderFactory";
import { ISocialProviderPresenter, ISocialProviderSubscriber } from "../../view/input/social/base/SocialProviderPresenter";

export interface ISocialFieldPresenter extends IFieldPresenter {
  showLoading(): void;
  hideLoading(): void;

  clearValue(): void;
  hasValue(): boolean;
}

export class SocialFieldPresenterImpl extends BaseFieldPresenter<ISocialInputView> implements ISocialFieldPresenter, ISocialProviderSubscriber {
  protected readonly providersP: ISocialProviderPresenter[];

  protected usedProvider?: ISocialProviderPresenter;

  protected visible: boolean;

  public constructor(
    formD: IFormDeps, fieldM: ISocialFieldModel, inputV: ISocialInputView,
    fieldVal: IFieldValidator<ISocialFieldValue>, valueH: IValueHandler<ISocialFieldValue>,
    providersP: ISocialProviderPresenter[]) {
    super(formD, fieldM, inputV, fieldVal, valueH);

    this.providersP = providersP;
    this.providersP.forEach((p) => p.subscribe(this));

    this.visible = false;
  }

  onSocialLogin(providerP: ISocialProviderPresenter): void {
    if (this.visible) {
      this.usedProvider = providerP;
      this.listeners.forEach((listener) => listener.onSocialLogin && listener.onSocialLogin(this));
    }
  }

  public onShow(): void {
    this.visible = true;
  }

  public onHide(): void {
    this.visible = false;
  }

  public reset(): void {
    this.providersP.forEach((p) => p.reset());
    this.visible = false;
    super.reset();
  }

  public getValue(): Promise<ISocialFieldValue> {
    return Promise.resolve(this.usedProvider?.getLoginData());
  }

  public hasValue(): boolean {
    return this.usedProvider?.getLoginData() != undefined;
  }

  public clearValue(): void {
    this.usedProvider?.clearLoginData();
  }

  public block(): void {
    this.providersP.forEach((p) => p.block());
    super.block();
  }
  
  public unblock(): void {
    this.providersP.forEach((p) => p.unblock());
    super.unblock();
  }

  public showLoading(): void {
    this.usedProvider?.showLoading();
  }

  public hideLoading(): void {
    this.usedProvider?.hideLoading();
  }
}

export const SocialFieldPresenter = {
  create(formD: IFormDeps, fieldM: ISocialFieldModel): ISocialFieldPresenter {
    const providersP = formD.social.map((p) => SocialProviderFactory.create(p));
    const providersV = providersP.map((p) => p.getView());

    const inputV = SocialInputView.create(providersV);

    const fieldVal = FieldValidator.create([]);

    const valueH = DummyValueHandler.create(inputV, fieldM);

    return new SocialFieldPresenterImpl(formD, fieldM, inputV, fieldVal, valueH, providersP);
  },

  matches(compP: IComponentPresenter): compP is ISocialFieldPresenter {
    return compP instanceof SocialFieldPresenterImpl;
  },
}