import { IFormDeps } from "../../../form/FormPresenter";
import { ISocialFieldModel, ISocialFieldValue } from "../../model/FieldModel";
import { ISocialInputViewListener, SocialInputView, ISocialInputView } from "../../view/input/SocialInputView";
import { DummyValueHandler } from "../handler/DummyValueHandler";
import { FieldRules } from "../validator/FieldRules";
import { FieldValidator, IFieldValidator } from "../validator/FieldValidator";
import { IFieldPresenter } from "./FieldPresenter";
import { BaseFieldPresenter } from "./BaseFieldPresenter";
import { IValueHandler } from "../handler/ValueHandler";

export interface ISocialFieldPresenter extends IFieldPresenter {
  showLoading(): void;
  hideLoading(): void;
}

export class SocialFieldPresenter extends BaseFieldPresenter<ISocialInputView> implements ISocialInputViewListener, ISocialFieldPresenter {
  private constructor(
    formD: IFormDeps, fieldM: ISocialFieldModel, inputV: ISocialInputView,
    fieldVal: IFieldValidator<ISocialFieldValue>, valueH: IValueHandler<ISocialFieldValue>) {
    super(formD, fieldM, inputV, fieldVal, valueH);
  }

  public static create(formD: IFormDeps, fieldM: ISocialFieldModel): ISocialFieldPresenter {
    const inputV = SocialInputView.create(formD);

    const fieldVal = FieldValidator.create([
      FieldRules.require(fieldM),
    ]);

    const valueH = DummyValueHandler.create(inputV, fieldM);

    return new SocialFieldPresenter(formD, fieldM, inputV, fieldVal, valueH);
  }

  public onLogin(): void {
    this.listeners.forEach((listener) => listener.onSocialLogin && listener.onSocialLogin(this));
  }

  public onShow(): void {
    this.inputV.onShow && this.inputV.onShow();
  }

  public onHide(): void {
    super.onHide();
    this.inputV.onHide && this.inputV.onHide();
  }

  showLoading(): void {
    this.inputV.showLoading();
  }

  hideLoading(): void {
    this.inputV.hideLoading();
  }
}