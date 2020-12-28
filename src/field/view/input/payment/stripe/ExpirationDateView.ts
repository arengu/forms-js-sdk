import { IPaymentCardFieldModel } from '../../../../model/FieldModel';
import { IStripeElementComponents, IStripeElementRenderer, IStripeElementView, StripeElementViewImpl } from './StripeElementView';

export const ExpirationDateRenderer: IStripeElementRenderer = {
  renderRoot(comps: IStripeElementComponents): HTMLElement {
    const node = document.createElement('div');
    node.classList.add('af-payment-expirationDate');

    if (comps.label) {
      node.appendChild(comps.label);
    }

    const wrapper = document.createElement('div');
    wrapper.classList.add('af-payment-expirationDate-wrapper');
    node.appendChild(wrapper);

    wrapper.appendChild(comps.field);
    wrapper.appendChild(comps.icon);

    return node;
  },

  renderField(uid: string): HTMLElement {
    const node = document.createElement('div');
    node.classList.add('af-payment-expirationDate-field');
    node.setAttribute('id', `af-payment-expirationDate-${uid}`);

    return node;
  },

  renderIcon(): HTMLElement {
    const node = document.createElement('span');

    node.classList.add('af-payment-expirationDate-icon');

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
};

export const ExpirationDateView = {
  create(config: IPaymentCardFieldModel, required: boolean, uid: string): IStripeElementView {
    return new StripeElementViewImpl(ExpirationDateRenderer, config, required, uid);
  },
}
