import every from 'lodash/every';
import some from 'lodash/some';

import { StripeSDK } from "../../../../../deps/StripeSDK";
import { AppError } from "../../../../../error/AppError";
import { IArenguError } from "../../../../../error/ArenguError";
import { AppErrorCode, SDKErrorCode } from "../../../../../error/ErrorCodes";
import { SDKError } from "../../../../../error/SDKError";
import { IExtendedFormStyle } from "../../../../../form/model/FormStyle";
import { IPaymentFieldModel, IPaymentFieldValue } from "../../../../model/FieldModel";
import { IInputViewListener } from "../../../InputView";
import { PaymentDetailsState, IPaymentProvider } from "../PaymentProvider";
import { IStripeElementListener } from "./StripeElementView";
import { IStripeFields, IStripePaymentView, StripePaymentView } from "./StripePaymentView";

const API_VERSION = '2020-08-27';

export interface IAuthenticationData {
  clientSecret: string;
}

export const StripeHelper = {
  translateError(err: stripe.Error): IArenguError {
    if (err.code === 'payment_intent_authentication_failure') {
      return AppError.create({
        code: AppErrorCode.UNAUTH_PAYMENT,
        message: 'Payment was not authenticated by owner.',
        details: [],
      })
    }

    return SDKError.create(
      SDKErrorCode.ERR_GENERIC_ERROR,
      err.message || 'Generic error processing payment.',
    );
  },

  calculateState(fields: IStripeFields): PaymentDetailsState {
    const allAreEmpty = every(fields, (f) => f.getState() === PaymentDetailsState.EMPTY);

    if (allAreEmpty) {
      return PaymentDetailsState.EMPTY;
    }

    const allAreValid = every(fields, (f) => f.getState() === PaymentDetailsState.VALID);

    if (allAreValid) {
      return PaymentDetailsState.VALID;
    }

    const anyIsIncomplete = some(fields, (f) => f.getState() === PaymentDetailsState.INCOMPLETE);

    if (anyIsIncomplete) {
      return PaymentDetailsState.INCOMPLETE;
    }

    const anyIsInvalid = some(fields, (f) => f.getState() === PaymentDetailsState.INVALID);

    if (anyIsInvalid) {
      return PaymentDetailsState.INVALID;
    }

    const anyIsEmpty = some(fields, (f) => f.getState() === PaymentDetailsState.EMPTY);

    if (anyIsEmpty) {
      return PaymentDetailsState.INCOMPLETE;
    }

    return PaymentDetailsState.UNKNOWN;
  }
};

export class StripePaymentProviderImpl implements IPaymentProvider, IStripeElementListener {
  protected readonly paymentV: IStripePaymentView;

  protected readonly publicKey: string;

  protected sdk?: stripe.Stripe;

  protected card?: stripe.elements.Element;

  /** Avoid race conditions due to parallel requests to Stripe API */
  protected pmProm?: Promise<IPaymentFieldValue>;

  protected state: PaymentDetailsState;

  constructor(fieldM: IPaymentFieldModel, style: IExtendedFormStyle) {
    const { required, config } = fieldM;

    this.paymentV = StripePaymentView.create(config.fields, required, style);

    this.publicKey = config.credentials.publicKey;

    this.paymentV.listen(this);

    this.state = PaymentDetailsState.EMPTY;

    this.init();
  }

  init(): void {
    StripeSDK.getSDK((sdk) => this.onSDKLoad(sdk));
  }

  onSDKLoad(factory: stripe.StripeStatic): void {
    this.sdk = factory(this.publicKey, {
      apiVersion: API_VERSION,
    });

    const elems = this.sdk.elements();
    this.card = this.paymentV.init(elems);
  }

  onUpdateStyle(style: IExtendedFormStyle): void {
    this.paymentV.updateStyle(style);
  }

  async authenticate(data: IAuthenticationData): Promise<void> {
    if (!this.sdk) {
      return;
    }

    const res = await this.sdk.confirmCardPayment(data.clientSecret);

    if (res.paymentIntent) {
      return;
    }

    this.pmProm = undefined; // declined payment methods cannot be reused on rewind

    if (res.error) {
      throw StripeHelper.translateError(res.error);
    }
  }

  async createCard(): Promise<string | undefined> {
    if (!this.sdk || !this.card) {
      return;
    }

    const res = await this.sdk.createPaymentMethod('card', this.card);

    if (res.paymentMethod) {
      return res.paymentMethod.id;
    }

    if (res.error) {
      throw StripeHelper.translateError(res.error);
    }
  }

  async getValue(): Promise<IPaymentFieldValue> {
    if (this.getState() !== PaymentDetailsState.VALID) {
      return Promise.resolve(undefined);
    }

    if (!this.pmProm) {
      this.pmProm = this.createCard();
    }

    return Promise.resolve(this.pmProm);
  }

  listen(listener: IInputViewListener): void {
    this.paymentV.listen(listener);
  }

  getState(): PaymentDetailsState {
    return this.state;
  }

  onInput(): void {
    this.state = StripeHelper.calculateState(this.paymentV.getFields());
    this.pmProm = undefined; // discard the created payment method on change
  }

  block(): void {
    this.paymentV.block();
  }

  unblock(): void {
    this.paymentV.unblock();
  }

  render(): HTMLElement {
    return this.paymentV.render();
  }

  reset(): void {
    // nothing to do here
  }
}

export const StripePaymentProvider = {
  create(fieldM: IPaymentFieldModel, style: IExtendedFormStyle): IPaymentProvider {
    return new StripePaymentProviderImpl(fieldM, style);
  }
}
