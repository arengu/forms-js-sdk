import LegacyPaymentInput from './legacy/LegacyPaymentInput';
import { IPaymentFieldModel } from '../../model/FieldModel';
import { IInputView, IInputViewListener } from '../InputView';
import { ListenableEntity } from '../../../lib/ListenableEntity';
import { UID } from '../../../lib/UID';
import { IFormDeps } from '../../../form/FormPresenter';
import { IExtendedFormStyle } from '../../../form/model/FormStyle';

export interface ICardToken {
  id?: string;
}

export enum CardErrorCode {
  INCOMPLETE_NUMBER = 'incomplete_number',
  INCOMPLETE_EXPIRY = 'incomplete_expiry',
  INCOMPLETE_CVC = 'incomplete_cvc',
  INVALID_NUMBER = 'invalid_number',
  INVALID_EXPIRY_MONTH = 'invalid_expiry_month',
  INVALID_EXPIRY_MONTH_PAST = 'invalid_expiry_month_past',
  INVALID_EXPIRY_YEAR = 'invalid_expiry_year',
  INVALID_EXPIRY_YEAR_PAST = 'invalid_expiry_year_past',
  INVALID_CVC = 'invalid_cvc',
}

export interface ICardError {
  code: string;
  type: string;
  message: string;
}

export interface ICreateTokenResponse {
  token?: ICardToken;
  error?: ICardError;
}

export interface ILegacyPaymentListener {
  /**
   * This event is fired when the user writes either the first or the last character.
   */
  onUpdate(this: this): void;
  onFocus(this: this): void;
  onBlur(this: this): void;
}

export interface IPaymentInputView extends IInputView {
  processCard(): Promise<void>;
  getToken(): ICardToken | undefined;
  isEmpty(): boolean;
  isComplete(): boolean;
  isInvalid(): boolean;
}

/*
 * Useful credit cards for testing:
 *  - charge declined   4000000000000002
 *  - expired card      4000000000000069
 *  - incorrect cvc     4000000000000127
 *  - processing error  4000000000000119
 */

export class PaymentInputView extends ListenableEntity<IInputViewListener> implements IPaymentInputView, ILegacyPaymentListener {
  protected readonly paymentV: LegacyPaymentInput;

  /* Indicates if the input was modified between onFocus and onBlur to fire onChange */
  protected changed: boolean;

  /* Indicates if the existing token is valid or we have to create a new one */
  protected fresh: boolean;

  protected token?: ICardToken;

  protected error?: ICardError;

  protected constructor(formD: IFormDeps, fieldM: IPaymentFieldModel) {
    super();

    const uid = UID.create();

    this.paymentV = LegacyPaymentInput.create(fieldM, formD.style, uid, this);
    this.changed = false;
    this.fresh = false;
    this.token = undefined;
    this.error = undefined;
  }

  public static create(formD: IFormDeps, fieldM: IPaymentFieldModel): IPaymentInputView {
    return new this(formD, fieldM);
  }

  public async processCard(): Promise<void> {
    if (this.fresh) {
      return;
    }

    const res: ICreateTokenResponse = await this.paymentV.processCard();

    this.token = res.token || undefined;
    this.error = res.error || undefined;

    this.fresh = true;
  }

  public getValue(): never { // eslint-disable-line class-methods-use-this
    throw new Error('Not implemented');
  }

  public setValue(): never { // eslint-disable-line class-methods-use-this
    throw new Error('Not allowed for security purposes');
  }

  public getToken(): ICardToken | undefined {
    return this.token;
  }

  public isEmpty(): boolean {
    return this.paymentV.isEmpty();
  }

  public isComplete(): boolean {
    return this.paymentV.isComplete();
  }

  public isInvalid(): boolean {
    return this.paymentV.isInvalid();
  }

  public onFocus(this: this): void {
    this.changed = false;

    this.listeners.forEach((listener) => listener.onFocus && listener.onFocus());
  }

  public onBlur(this: this): void {
    if (this.changed) {
      this.listeners.forEach((listener) => listener.onChange && listener.onChange());
    }

    this.listeners.forEach((listener) => listener.onBlur && listener.onBlur());
  }

  public onUpdate(this: this): void {
    this.changed = true;

    this.fresh = false;
    this.listeners.forEach((listener) => listener.onInput && listener.onInput());
  }

  public reset(): void {
    this.fresh = false;
    this.token = undefined;
    this.error = undefined;
    this.paymentV.reset();
  }

  public block(): void {
    // not implemented yet
  }

  public unblock(): void {
    // not implemented yet
  }

  public render(): HTMLElement {
    return this.paymentV.render();
  }

  public onUpdateStyle(style: IExtendedFormStyle): void {
    this.paymentV.onUpdateStyle(style);
  }
}
