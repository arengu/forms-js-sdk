const FieldPresenter = require('./FieldPresenter');

const PaymentView = require('./PaymentView');

class PaymentPresenter extends FieldPresenter {
  static createToken (paymentV) {
    return PaymentView.createToken(paymentV.fieldV);
  }

  static create (...args) {
    return new PaymentPresenter(...args);
  }
}

module.exports = PaymentPresenter;
