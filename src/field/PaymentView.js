const FieldView = require('./FieldView');

class PaymentView extends FieldView {
  static createToken (fieldV) {
    return fieldV.inputV._createToken();
  }

  static create () {
    return new PaymentView(...arguments);
  }
}

module.exports = PaymentView;
