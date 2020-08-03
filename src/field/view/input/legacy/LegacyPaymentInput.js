import isNil from 'lodash/isNil';
import defaultTo from 'lodash/defaultTo';

const STRIPE_SDK_URL = 'https://js.stripe.com/v3/';
const STRIPE_SDK_LOAD = 'af-stripeLoad';

let isStripeLoaded = false;

/* eslint-disable */

class LegacyPaymentInput {
  constructor(fieldM, style, uid, paymentL) {
    this.model = fieldM;
    this.style = style;
    this.uid = uid;
    this.listener = paymentL;

    this.cardNumber = undefined;
    this.cardNumberMounted = undefined;
    this.isCardNumberEmpty = true;
    this.isCardNumberComplete = false;
    this.isCardNumberInvalid = false;

    this.expirationDate = undefined;
    this.expirationDateMounted = undefined;
    this.isExpirationDateEmpty = true;
    this.isExpirationDateComplete = false;
    this.isExpirationDateInvalid = false;

    this.securityCode = undefined;
    this.securityCodeMounted = undefined;
    this.isSecurityCodeEmpty = true;
    this.isSecurityCodeComplete = false;
    this.isSecurityCodeInvalid = false;

    this.trustmarks = 'unknown';
    this.trustmarksSelector = undefined;

    this.stripe = undefined;

    this.viewE = undefined;
  }

  static create(fieldM, style, uid, paymentL) {
    return new this(fieldM, style, uid, paymentL);
  }

  _buildElementStyles() {
    const computedStyle = getComputedStyle(document.documentElement);

    const styles = {
      base: {
        color: this.style.input?.fontColor || computedStyle.getPropertyValue('--input-color'),
        fontFamily: this.style.body?.fontFamily || computedStyle.getPropertyValue('--font-family'),
        fontSize: this.style.input?.fontSize || computedStyle.getPropertyValue('--input-font-size'),
        '::placeholder': {
          color:
            this.style.calculated?.placeholderFontColor ||
            computedStyle.getPropertyValue('--placeholder-color'),
        },
      },
      invalid: {
        color:
          this.style.error?.fontColor ||
          computedStyle.getPropertyValue('--message-fail-color'),
      },
    };

    return styles;
  }

  _addCardNumberListener(element) {
    const self = this;
    element.addEventListener('focus', () => self.listener.onFocus());
    element.addEventListener('blur', () => self.listener.onBlur());
    element.addEventListener('change', (e) => {
      const hasError = e.error && !e.empty;

      self.isCardNumberEmpty = e.empty;
      self.isCardNumberComplete = e.complete;
      self.isCardNumberInvalid = hasError;

      const node = self.trustmarksSelector;

      if (hasError) {
        node.classList.add('af-payment-cardNumber-brand-error');
      } else {
        node.classList.remove('af-payment-cardNumber-brand-error');
      }

      const newBrand = e.brand || 'unknown';

      if (self.trustmarks !== newBrand) {
        node.classList.remove(`af-payment-cardNumber-brand-${self.trustmarks}`);
        node.classList.add(`af-payment-cardNumber-brand-${newBrand}`);
        self.trustmarks = newBrand;
      }

      self.listener.onUpdate(); // stripe.onChange does not equal to html.onChange
    });
  }

  _addCardNumberIconListener(node) {
    const self = this;

    node.onclick = function () {
      self.cardNumberMounted.focus();
    };
  }

  _buildCardNumberLabel(uid) {
    const { required, config: { fields: { cardNumber: { label } } } } = this.model;

    const container = document.createElement('div');
    container.classList.add('af-field-label');

    const node = document.createElement('label');
    node.setAttribute('for', uid);
    node.innerHTML = label;
    container.appendChild(node);

    if (required) {
      node.classList.add('af-required');
    }

    return container;
  }

  _buildCardNumberField() {
    const node = document.createElement('div');
    node.classList.add('af-payment-cardNumber-field');
    node.setAttribute('id', `af-payment-cardNumber-${this.uid}`);

    this.cardNumber = node;

    return node;
  }

  _buildCardNumberIcon() {
    const node = document.createElement('span');
    node.classList.add('af-payment-cardNumber-brand');
    node.classList.add(`af-payment-cardNumber-brand-${this.trustmarks}`);

    this._addCardNumberIconListener(node);

    this.trustmarksSelector = node;
    return node;
  }

  _buildCardNumber() {
    const { config: { fields: { cardNumber: { label } } } } = this.model;

    const node = document.createElement('div');
    node.classList.add('af-payment-cardNumber');

    const cardNumberField = this._buildCardNumberField();
    const cardNumberIcon = this._buildCardNumberIcon();

    if (label) {
      const cardNumberLabel = this._buildCardNumberLabel(cardNumberField.id);
      node.appendChild(cardNumberLabel);
    }

    const wrapper = document.createElement('div');
    wrapper.classList.add('af-payment-cardNumber-wrapper');
    node.appendChild(wrapper);

    wrapper.appendChild(cardNumberField);
    wrapper.appendChild(cardNumberIcon);

    return node;
  }

  _addExpirationDateListener(element) {
    const self = this;
    element.addEventListener('focus', () => self.listener.onFocus());
    element.addEventListener('blur', () => self.listener.onBlur());
    element.addEventListener('change', (e) => {
      const hasError = e.error && !e.empty;

      self.isExpirationDateEmpty = e.empty;
      self.isExpirationDateComplete = e.complete;
      self.isExpirationDateInvalid = hasError;

      self.listener.onUpdate(); // stripe.onChange does not equal to html.onChange
    });
  }

  _addExpirationIconDateListener(node) {
    const self = this;

    node.onclick = function () {
      self.expirationDateMounted.focus();
    };
  }

  _buildExpirationDateField() {
    const node = document.createElement('div');
    node.classList.add('af-payment-expirationDate-field');
    node.setAttribute('id', `af-payment-expirationDate-${this.uid}`);

    this.expirationDate = node;

    return node;
  }

  _buildExpirationDateIcon() {
    const node = document.createElement('span');
    node.classList.add('af-payment-expirationDate-icon');

    this._addExpirationIconDateListener(node);

    return node;
  }

  _buildExpirationDateLabel(uid) {
    const { required, config: { fields: { expirationDate: { label } } } } = this.model;

    const container = document.createElement('div');
    container.classList.add('af-field-label');

    const node = document.createElement('label');
    node.setAttribute('for', uid);
    node.innerHTML = label;
    container.appendChild(node);

    if (required) {
      node.classList.add('af-required');
    }

    return container;
  }

  _buildExpirationDate() {
    const { config: { fields: { expirationDate: { label } } } } = this.model;

    const node = document.createElement('div');
    node.classList.add('af-payment-expirationDate');

    const expirationDateField = this._buildExpirationDateField();
    const expirationDateIcon = this._buildExpirationDateIcon();

    if (label) {
      const expirationDateLabel = this._buildExpirationDateLabel(expirationDateField.id);
      node.appendChild(expirationDateLabel);
    }

    const wrapper = document.createElement('div');
    wrapper.classList.add('af-payment-expirationDate-wrapper');
    node.appendChild(wrapper);

    wrapper.appendChild(expirationDateField);
    wrapper.appendChild(expirationDateIcon);

    return node;
  }

  _addSecurityCodeListener(element) {
    const self = this;
    element.addEventListener('focus', () => self.listener.onFocus());
    element.addEventListener('blur', () => self.listener.onBlur());
    element.addEventListener('change', (e) => {
      const hasError = e.error && !e.empty;

      self.isSecurityCodeEmpty = e.empty;
      self.isSecurityCodeComplete = e.complete;
      self.isSecurityCodeInvalid = hasError;

      self.listener.onUpdate(); // stripe.onChange does not equal to html.onChange
    });
  }

  _addSecuriyCodeIconListener(node) {
    const self = this;

    node.onclick = function () {
      self.securityCodeMounted.focus();
    };
  }

  _buildSecurityCodeField() {
    const node = document.createElement('div');
    node.classList.add('af-payment-securityCode-field');
    node.setAttribute('id', `af-payment-securityCode-${this.uid}`);

    this.securityCode = node;
    return node;
  }

  _buildSecurityCodeLabel(uid) {
    const { required, config: { fields: { securityCode: { label } } } } = this.model;

    const container = document.createElement('div');
    container.classList.add('af-field-label');

    const node = document.createElement('label');
    node.setAttribute('for', uid);
    node.innerHTML = label;
    container.appendChild(node);

    if (required) {
      node.classList.add('af-required');
    }

    return container;
  }

  _buildSecurityCodeIcon() {
    const node = document.createElement('span');
    node.classList.add('af-payment-securityCode-icon');

    this._addSecuriyCodeIconListener(node);

    return node;
  }

  _buildSecurityCode() {
    const { config: { fields: { securityCode: { label } } } } = this.model;

    const node = document.createElement('div');
    node.classList.add('af-payment-securityCode');

    const securityCodeField = this._buildSecurityCodeField();
    const securityCodeIcon = this._buildSecurityCodeIcon();

    if (label) {
      const securityCodeLabel = this._buildSecurityCodeLabel(securityCodeField.id);
      node.appendChild(securityCodeLabel);
    }

    const wrapper = document.createElement('div');
    wrapper.classList.add('af-payment-securityCode-wrapper');
    node.appendChild(wrapper);

    wrapper.appendChild(securityCodeField);
    wrapper.appendChild(securityCodeIcon);

    return node;
  }

  _buildTrustmarks() {
    const node = document.createElement('div');
    node.classList.add('af-payment-trustmarks');

    return node;
  }

  _initStripeSdk() {
    const { config: { credentials: { publicKey } } } = this.model;
    const { config: { fields } } = this.model;

    const
      cardNumberPlaceholder = defaultTo(fields.cardNumber.placeholder, undefined),
      expirationDatePlaceholder = defaultTo(fields.expirationDate.placeholder, undefined),
      securityCodePlaceholder = defaultTo(fields.securityCode.placeholder, undefined);

    const stripe = Stripe(publicKey);
    const elements = stripe.elements();
    const style = this._buildElementStyles();

    const cardNumber = elements.create('cardNumber', { style, placeholder: cardNumberPlaceholder });
    cardNumber.mount(this.cardNumber);
    this._addCardNumberListener(cardNumber);

    const expirationDate = elements.create('cardExpiry', { style, placeholder: expirationDatePlaceholder });
    expirationDate.mount(this.expirationDate);
    this._addExpirationDateListener(expirationDate);

    const securityCode = elements.create('cardCvc', { style, placeholder: securityCodePlaceholder });
    securityCode.mount(this.securityCode);
    this._addSecurityCodeListener(securityCode);

    this.cardNumberMounted = cardNumber;
    this.expirationDateMounted = expirationDate;
    this.securityCodeMounted = securityCode;
    this.stripe = stripe;
  }

  _waitLoadEventAndInitSdk() {
    document.addEventListener(STRIPE_SDK_LOAD, () => this._initStripeSdk());
  }

  _triggerStripeLoadEvent() {
    const event = new CustomEvent(STRIPE_SDK_LOAD);
    return document.dispatchEvent(event);
  }

  _loadStripeSdk() {
    const selector = document.querySelector('head') || document.querySelector('body');

    const self = this;

    const node = document.createElement('script');
    node.type = 'text/javascript';
    node.src = STRIPE_SDK_URL;
    node.onload = function () {
      self._triggerStripeLoadEvent();
    };

    return selector.appendChild(node);
  }

  async processCard() {
    return this.stripe.createToken(this.cardNumberMounted);
  }

  render() {
    if (!isNil(this.viewE)) {
      return this.viewE;
    }

    const { config: { fields: { trustmarks } } } = this.model;

    const container = document.createElement('div');
    container.classList.add('af-payment');

    const cardNumber = this._buildCardNumber();
    container.appendChild(cardNumber);

    const expirationDate = this._buildExpirationDate();
    container.appendChild(expirationDate);

    const securityCode = this._buildSecurityCode();
    container.appendChild(securityCode);

    if (trustmarks) {
      const trustmarks = this._buildTrustmarks();
      container.appendChild(trustmarks);
    }

    if (!isStripeLoaded) {
      isStripeLoaded = true;
      this._waitLoadEventAndInitSdk();
      this._loadStripeSdk();
    } else if (typeof Stripe === 'undefined') {
      this._waitLoadEventAndInitSdk();
    } else {
      this._initStripeSdk();
    }

    this.viewE = container;

    return this.viewE;
  }

  onUpdateStyle(style) {
    this.style = style;

    const elemStyles = this._buildElementStyles();

    this.cardNumberMounted.update({ style: elemStyles });
    this.expirationDateMounted.update({ style: elemStyles });
    this.securityCodeMounted.update({ style: elemStyles });
  }

  reset() {
    this.cardNumberMounted.clear();
    this.expirationDateMounted.clear();
    this.securityCodeMounted.clear();
  }

  isEmpty() {
    return this.isCardNumberEmpty && this.isExpirationDateEmpty && this.isSecurityCodeEmpty;
  }

  isComplete() {
    return this.isCardNumberComplete && this.isExpirationDateComplete && this.isSecurityCodeComplete;
  }

  isInvalid() {
    return this.isCardNumberInvalid || this.isExpirationDateInvalid || this.isSecurityCodeInvalid;
  }
}

/* eslint-enable */

export default LegacyPaymentInput;
