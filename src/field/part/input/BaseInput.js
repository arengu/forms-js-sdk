const BaseView = require('../../../base/BaseView');
const FieldValidator = require('../../FieldValidator');

class BaseInput extends BaseView {

  constructor (model, presenter) {
    super();
    this.model = model;
    this.presenter = presenter;
  }

  get id () {
    return this.model.id;
  }

  get value () {
    return null;
  }

  validate () {
    return FieldValidator.validate(this.model, this.value);
  }

}

module.exports = BaseInput;
