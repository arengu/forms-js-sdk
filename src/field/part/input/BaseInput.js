const BaseView = require('../../../base/BaseView');
const FieldValidator = require('../../FieldValidator');

class BaseInput extends BaseView {

  constructor (model) {
    super();
    this.model = model;
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
