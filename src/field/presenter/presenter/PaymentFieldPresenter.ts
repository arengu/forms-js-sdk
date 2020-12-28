import { IFormDeps } from "../../../form/FormPresenter";
import { IPaymentFieldModel, IPaymentFieldValue } from "../../model/FieldModel";
import { FieldValidator, IFieldValidator } from "../validator/FieldValidator";
import { IFieldPresenter } from "./FieldPresenter";
import { BaseFieldPresenter } from "./BaseFieldPresenter";
import { IValueHandler } from "../handler/ValueHandler";
import { IPaymentInputView, PaymentInputView } from "../../view/input/PaymentInputView";
import { IPaymentProvider, PaymentProvider } from "../../view/input/payment/PaymentProvider";
import { CustomValidations } from "../validator/CustomValidations";
import { IExtendedFormStyle } from "../../../form/model/FormStyle";
import { PaymentValueHandler } from "../handler/PaymentValueHandler";
import { IInputViewListener } from "../../view/InputView";

export interface IPaymentFieldPresenter extends IFieldPresenter {
  authenticate(data: object): Promise<void>;
}

export class PaymentFieldPresenterImpl extends BaseFieldPresenter<IPaymentInputView> implements IInputViewListener, IPaymentFieldPresenter {
  protected readonly providerP: IPaymentProvider;

  public constructor(
    formD: IFormDeps, fieldM: IPaymentFieldModel, inputV: IPaymentInputView,
    fieldVal: IFieldValidator<IPaymentFieldValue>, valueH: IValueHandler<IPaymentFieldValue>,
    providerP: IPaymentProvider) {
    super(formD, fieldM, inputV, fieldVal, valueH);

    this.providerP = providerP;

    this.providerP.listen(this);
  }

  onUpdateStyle(style: IExtendedFormStyle): void {
    this.providerP.onUpdateStyle(style);
  }

  getValue(): Promise<IPaymentFieldValue> {
    return this.providerP.getValue();
  }

  block(): void {
    super.block();
    this.providerP.block();
  }

  unblock(): void {
    super.unblock();
    this.providerP.unblock();
  }

  authenticate(data: object): Promise<void> {
    return this.providerP.authenticate(data);
  }
}

export const PaymentFieldPresenter = {
  create(formD: IFormDeps, fieldM: IPaymentFieldModel): IPaymentFieldPresenter {
    const providerP = PaymentProvider.create(fieldM, formD.style);

    const inputV = PaymentInputView.create(providerP.render())

    const fieldVal = FieldValidator.create([
      CustomValidations.payment(fieldM, providerP),
    ]);

    const valueH = PaymentValueHandler.create();

    return new PaymentFieldPresenterImpl(formD, fieldM, inputV, fieldVal, valueH, providerP);
  },

  matches(fieldP: IFieldPresenter): fieldP is IPaymentFieldPresenter {
    return fieldP instanceof PaymentFieldPresenterImpl;
  },
}
