const FieldView = require('./FieldView');

class PaymentView extends FieldView {
  static createToken (fieldV) {
    return fieldV.inputV._createToken();
  }

  static create (...args) {
    return new PaymentView(...args);
  }
}

module.exports = PaymentView;
