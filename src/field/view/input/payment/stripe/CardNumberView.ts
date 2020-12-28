import { IStripeElementComponents, IStripeElementRenderer, IStripeElementView, StripeElementViewImpl } from './StripeElementView';
import { IPaymentCardFieldModel } from '../../../../model/FieldModel';
import { PaymentDetailsState } from '../PaymentProvider';

export const CardIcon = {
  GENERIC: 'af-payment-cardNumber-brand-unknown',

  INVALID: 'af-payment-cardNumber-brand-error',

  fromBrand(brand: string): string {
    return `af-payment-cardNumber-brand-${brand}`;
  },
};

export const CardNumberRenderer: IStripeElementRenderer = {
  renderRoot(comps: IStripeElementComponents): HTMLElement {
    const node = document.createElement('div');
    node.classList.add('af-payment-cardNumber');

    if (comps.label) {
      node.appendChild(comps.label);
    }

    const wrapper = document.createElement('div');
    wrapper.classList.add('af-payment-cardNumber-wrapper');
    node.appendChild(wrapper);

    wrapper.appendChild(comps.field);
    wrapper.appendChild(comps.icon);

    return node;
  },

  renderField(uid: string): HTMLElement {
    const node = document.createElement('div');
    node.classList.add('af-payment-cardNumber-field');
    node.setAttribute('id', `af-payment-cardNumber-${uid}`);

    return node;
  },

  renderIcon(): HTMLElement {
    const node = document.createElement('span');
    node.classList.add('af-payment-cardNumber-brand');

    node.classList.add(CardIcon.GENERIC);

    return node;
  },

  renderLabel(text: string, required: boolean, uid: string): HTMLDivElement {
    const container = document.createElement('div');
    container.classList.add('af-field-label');

    const node = document.createElement('label');
    node.setAttribute('for', uid);
    node.innerHTML = text;
    container.appendChild(node);

    if (required) {
      node.classList.add('af-required');
    }

    return container;
  },
}

export class CardNumberViewImpl extends StripeElementViewImpl {
  static readonly DEFAULT_BRAND = 'unknown';

  /** Stores the CSS class associated to the current card icon */
  protected currentIcon: string;

  /** Stores the brand name of the current card */
  protected brandName: string;

  constructor(config: IPaymentCardFieldModel, required: boolean, uid: string) {
    super(CardNumberRenderer, config, required, uid);
    this.currentIcon = CardIcon.GENERIC;
    this.brandName = CardNumberViewImpl.DEFAULT_BRAND;
  }

  setIcon(newIcon: string): void {
    this.iconE.classList.replace(this.currentIcon, newIcon);
    this.currentIcon = newIcon;
  }

  setInvalidIcon(): void {
    this.setIcon(CardIcon.INVALID);
  }

  setBrandIcon(brand: string): void {
    this.setIcon(CardIcon.fromBrand(brand));
  }

  onStripeInput(change: stripe.elements.ElementChangeResponse): void {
    super.onStripeInput(change);
    this.brandName = change.brand;
  }

  onChange(): void {
    super.onChange();

    if (this.state === PaymentDetailsState.INVALID) {
      return this.setInvalidIcon();
    }

    this.setBrandIcon(this.brandName);
  }
}

export const CardNumberView = {
  create(config: IPaymentCardFieldModel, required: boolean, uid: string): IStripeElementView {
    return new CardNumberViewImpl(config, required, uid);
  },
}