const FieldPresenter = require('./FieldPresenter');

const PaymentView = require('./PaymentView');

class PaymentPresenter extends FieldPresenter {
  static createToken (paymentV) {
    return PaymentView.createToken(paymentV.fieldV);
  }

  static create () {
    return new PaymentPresenter(...arguments);
  }
}

module.exports = PaymentPresenter;
