import LegacyPaymentInput from './legacy/LegacyPaymentInput';
import { IPaymentFieldModel } from '../../model/FieldModel';
import { IInputView, IInputViewListener } from '../InputView';

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

export type IPaymentInputValue = undefined;

export interface IPaymentInputView extends IInputView<IPaymentInputValue> {
  processCard(): Promise<void>;
  getToken(): ICardToken | undefined;
  isEmpty(): boolean;
  isComplete(): boolean;
  isValid(): boolean;
}

/*
 * Useful credit cards for testing:
 *  - charge declined   4000000000000002
 *  - expired card      4000000000000069
 *  - incorrect cvc     4000000000000127
 *  - processing error  4000000000000119
 */

export class PaymentInputView implements IPaymentInputView, ILegacyPaymentListener {
  protected readonly paymentV: LegacyPaymentInput;

  protected readonly inputL: IInputViewListener;

  /* Indicates if the input was modified between onFocus and onBlur to fire onChange */
  protected changed: boolean;

  /* Indicates if the existing token is valid or we have to create a new one */
  protected fresh: boolean;

  protected token?: ICardToken;

  protected error?: ICardError;

  protected constructor(fieldM: IPaymentFieldModel, uid: string, inputL: IInputViewListener) {
    this.paymentV = LegacyPaymentInput.create(fieldM, uid, this);
    this.inputL = inputL;
    this.changed = false;
    this.fresh = false;
    this.token = undefined;
    this.error = undefined;
  }

  public static create(fieldM: IPaymentFieldModel, uid: string,
    inputL: IInputViewListener): PaymentInputView {
    return new this(fieldM, uid, inputL);
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

  public isValid(): boolean {
    return this.paymentV.isValid();
  }

  public onFocus(this: this): void {
    this.changed = false;

    this.inputL.onFocus();
  }

  public onBlur(this: this): void {
    if (this.changed) {
      this.inputL.onChange();
    }

    this.inputL.onBlur();
  }

  public onUpdate(this: this): void {
    this.changed = true;

    this.fresh = false;
    this.inputL.onInput();
  }

  public reset(): void {
    this.fresh = false;
    this.token = undefined;
    this.error = undefined;
    this.paymentV.reset();
  }

  public render(): HTMLElement {
    return this.paymentV.render();
  }
}
