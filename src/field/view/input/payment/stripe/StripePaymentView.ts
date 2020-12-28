import forEach from "lodash/forEach";
import defaultTo from "lodash/defaultTo";

import { IView } from "../../../../../core/BaseTypes";
import { IExtendedFormStyle } from "../../../../../form/model/FormStyle";
import { UID } from "../../../../../lib/UID";
import { IPaymentCardFieldsConfig } from "../../../../model/FieldModel";
import { CardNumberView } from "./CardNumberView";
import { ExpirationDateView } from "./ExpirationDateView";
import { SecurityCodeView } from "./SecurityCodeView";
import { IStripeElementListener, IStripeElementView } from "./StripeElementView";

export type IPaymentProviderView = IView;

export interface IStripePaymentView extends IPaymentProviderView {
  init(elems: stripe.elements.Elements): stripe.elements.Element;

  block(): void;
  unblock(): void;

  getFields(): IStripeFields;

  listen(listener: IStripeElementListener): void;

  updateStyle(newStyle: IExtendedFormStyle): void;
}

export interface IStripeFields {
  cardNumber: IStripeElementView;
  expirationDate: IStripeElementView;
  securityCode: IStripeElementView;
}

export type IStripeStyle = stripe.elements.ElementsOptions['style'] & object;

export const StripePaymentViewHelper = {
  renderRoot(fields: IStripeFields): HTMLElement {
    const node = document.createElement('div');

    forEach(fields, (f) => node.appendChild(f.render()));

    return node;
  },

  buildStyle(style: IExtendedFormStyle): IStripeStyle {
    const computedStyle = getComputedStyle(document.documentElement);

    const styles = {
      base: {
        color:
          style.input?.fontColor ||
          computedStyle.getPropertyValue('--input-color').trim(),
        fontFamily:
          style.body?.fontFamily ||
          computedStyle.getPropertyValue('--font-family').trim(),
        fontSize:
          style.input?.fontSize ||
          computedStyle.getPropertyValue('--input-font-size').trim(),
        '::placeholder': {
          color:
            style.calculated?.placeholderFontColor ||
            computedStyle.getPropertyValue('--placeholder-color').trim(),
        },
      },
      invalid: {
        color:
          style.error?.fontColor ||
          computedStyle.getPropertyValue('--message-fail-color').trim(),
      },
    };

    return styles;
  }
};

export class StripePaymentViewImpl implements IStripePaymentView {
  protected readonly config: IPaymentCardFieldsConfig;

  protected style: IStripeStyle;

  protected readonly fieldsV: IStripeFields;

  protected readonly rootE: HTMLElement;

  constructor(config: IPaymentCardFieldsConfig, required: boolean, style: IExtendedFormStyle) {
    this.config = config;

    this.style = StripePaymentViewHelper.buildStyle(style);

    const uid = UID.create();

    this.fieldsV = {
      cardNumber: CardNumberView.create(config.cardNumber, required, uid),
      expirationDate: ExpirationDateView.create(config.expirationDate, required, uid),
      securityCode: SecurityCodeView.create(config.securityCode, required, uid),
    }

    this.rootE = StripePaymentViewHelper.renderRoot(this.fieldsV);
  }

  init(elems: stripe.elements.Elements): stripe.elements.Element {
    const cn = elems.create(
      'cardNumber',
      {
        style: this.style,
        placeholder: defaultTo(this.config.cardNumber.placeholder, undefined),
      },
    );
    this.fieldsV.cardNumber.init(cn);

    const ed = elems.create(
      'cardExpiry',
      {
        style: this.style,
        placeholder: defaultTo(this.config.expirationDate.placeholder, undefined),
      },
    );
    this.fieldsV.expirationDate.init(ed);

    const sc = elems.create(
      'cardCvc',
      {
        style: this.style,
        placeholder: defaultTo(this.config.securityCode.placeholder, undefined),
      },
    );
    this.fieldsV.securityCode.init(sc);

    return cn;
  }

  listen(listener: IStripeElementListener): void {
    forEach(this.fieldsV, (f) => f.listen(listener));
  }

  block(): void {
    forEach(this.fieldsV, (f) => f.block());
  }

  unblock(): void {
    forEach(this.fieldsV, (f) => f.unblock());
  }

  getFields(): IStripeFields {
    return this.fieldsV;
  }

  updateStyle(newStyle: IExtendedFormStyle): void {
    this.style = StripePaymentViewHelper.buildStyle(newStyle);
    forEach(this.fieldsV, (f) => f.updateStyle(this.style));
  }

  render(): HTMLElement {
    return this.rootE;
  }
}

export const StripePaymentView = {
  create(config: IPaymentCardFieldsConfig, required: boolean, style: IExtendedFormStyle): IStripePaymentView {
    return new StripePaymentViewImpl(config, required, style);
  }
}
