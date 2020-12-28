import { IInputView, IInputViewListener } from '../InputView';
import { ListenableEntity } from '../../../lib/ListenableEntity';

export const PaymentInputHelper = {
  renderRoot(providerV: HTMLElement): HTMLElement {
    const container = document.createElement('div');
    container.classList.add('af-payment');

    container.appendChild(providerV);

    return container;
  }
};

export type IPaymentInputView = IInputView;

export class PaymentInputViewImpl extends ListenableEntity<IInputViewListener> implements IPaymentInputView {
  protected readonly rootE: HTMLElement;

  public constructor(providerV: HTMLElement) {
    super();

    this.rootE = PaymentInputHelper.renderRoot(providerV);
  }

  public getValue(): never { // eslint-disable-line class-methods-use-this
    throw new Error('Not implemented');
  }

  public setValue(): never { // eslint-disable-line class-methods-use-this
    throw new Error('Not allowed for security purposes');
  }

  public reset(): void {
    // not implemented yet
  }

  public block(): void {
    // not implemented yet
  }

  public unblock(): void {
    // not implemented yet
  }

  public render(): HTMLElement {
    return this.rootE;
  }
}

export const PaymentInputView = {
  create(providerV: HTMLElement): IPaymentInputView {
    return new PaymentInputViewImpl(providerV);
  }
}
