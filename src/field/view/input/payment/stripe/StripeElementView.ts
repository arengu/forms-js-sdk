import { IPaymentCardFieldModel } from '../../../../model/FieldModel';
import { IView } from '../../../../../core/BaseTypes';
import { IStripeStyle } from './StripePaymentView';
import { PaymentDetailsState } from '../PaymentProvider';

export interface IStripeElementComponents {
  field: HTMLElement;
  icon: HTMLElement;
  label?: HTMLElement;
}

export interface IStripeElementListener {
  onFocus?(this: this): void;
  onInput?(this: this): void;
  onBlur?(this: this): void;
  onChange?(this: this): void;
}

export interface IStripeElementRenderer {
  renderRoot(comps: IStripeElementComponents): HTMLElement;
  renderField(uid: string): HTMLElement;
  renderIcon(): HTMLElement;
  renderLabel(text: string, required: boolean, uid: string): HTMLDivElement;
}

export const StripeElementHelper = {
  addIconListeners(iconE: HTMLElement, stripeE: stripe.elements.Element): void {
    iconE.addEventListener('click', () => stripeE.focus());
  },

  addStripeListeners(stripeE: stripe.elements.Element, self: StripeElementViewImpl): void {
    stripeE.addEventListener('focus', () => self.onFocus());
    stripeE.addEventListener('blur', () => self.onBlur());
    stripeE.addEventListener('change', (res) => { // see onStripeInput function for explanation
      if (res) { // we have to add this condition because typing says e may be undefined (due to a wrong specification)
        self.onStripeInput(res);
      }
    });
  },
};

export interface IStripeElementView extends IView {
  init(stripeE: stripe.elements.Element): void;

  getState(): PaymentDetailsState;

  block(): void;
  unblock(): void;

  listen(listener: IStripeElementListener): void;

  updateStyle(style: IStripeStyle): void;
  updateLabel(label: string): void;
}

export class StripeElementViewImpl implements IStripeElementView {
  protected readonly fieldE: HTMLElement;
  protected readonly iconE: HTMLElement;
  protected readonly labelE?: HTMLElement;

  protected readonly rootE: HTMLElement;

  protected stripe?: stripe.elements.Element;

  protected readonly listeners: IStripeElementListener[];

  protected modifiedAfterFocus: boolean;

  protected state: PaymentDetailsState;

  constructor(renderer: IStripeElementRenderer, config: IPaymentCardFieldModel, required: boolean, uid: string) {
    this.fieldE = renderer.renderField(uid);
    this.iconE = renderer.renderIcon();
    this.labelE = config.label ? renderer.renderLabel(config.label, required, uid) : undefined;

    this.rootE = renderer.renderRoot({
      field: this.fieldE,
      icon: this.iconE,
      label: this.labelE,
    });

    this.modifiedAfterFocus = false;

    this.state = PaymentDetailsState.EMPTY;

    this.listeners = [];
  }

  render(): HTMLElement {
    return this.rootE;
  }

  block(): void {
    this.stripe?.update({ disabled: true });
  }

  unblock(): void {
    this.stripe?.update({ disabled: false });
  }

  onFocus(): void {
    this.listeners.forEach((l) => l.onFocus?.());
  }

  onBlur(): void {
    this.listeners.forEach((l) => l.onBlur?.());

    if (this.modifiedAfterFocus) {
      this.modifiedAfterFocus = false;
      this.onChange();
    }
  }

  updateState(res: stripe.elements.ElementChangeResponse): void {
    if (res.empty) {
      this.state = PaymentDetailsState.EMPTY;
    } else if (res.complete) {
      this.state = PaymentDetailsState.VALID;
    } else if (!res.error) {
      this.state = PaymentDetailsState.INCOMPLETE;
    } else if (!res.error.code) {
      this.state = PaymentDetailsState.UNKNOWN;
    } else if (res.error.code.startsWith('incomplete')) {
      this.state = PaymentDetailsState.INCOMPLETE;
    } else {
      this.state = PaymentDetailsState.INVALID;
    }
  }

  getState(): PaymentDetailsState {
    return this.state;
  }

  onStripeInput(res: stripe.elements.ElementChangeResponse): void {
    /*
     * Stripe triggers this event when empty/complete/error property changes. It does not implement standard onInput event.
     *
     * As we have to trigger real onChange events, we have to combine this and onBlur event to simulate a close version.
     *
     * Our version is not complete neither because Stripe does not trigger the event when you replace an invalid value
     * with another invalid value (because any of the properties mentioned above has changed).
     */

    this.updateState(res);

    this.listeners.forEach((l) => l.onInput?.());

    this.modifiedAfterFocus = true;
  }

  onChange(): void {
    this.listeners.forEach((l) => l.onChange?.());
  }

  init(elem: stripe.elements.Element): void {
    this.stripe = elem;

    StripeElementHelper.addIconListeners(this.iconE, this.stripe);
    StripeElementHelper.addStripeListeners(this.stripe, this);

    this.stripe.mount(this.fieldE);
  }

  listen(listener: IStripeElementListener): void {
    this.listeners.push(listener);
  }

  updateStyle(style: IStripeStyle): void {
    this.stripe?.update({ style });
  }

  updateLabel(label: string): void {
    if (this.labelE) {
      this.labelE.innerHTML = label;
    }
  }
}
