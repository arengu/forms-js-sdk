const BaseView = require('../../../base/BaseView');

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

}

module.exports = BaseInput;
