const BaseModel = require('../base/BaseModel');

class FieldModel extends BaseModel {

  constructor (data) {
    super(data);
    this.id = data.id;
    this.label = data.label;
    this.hint = data.hint;
    this.placeholder = data.placeholder;
    this.type = data.type;
    this.required = data.required;
    this.config = data.config;
  }

  static create () {
    return new FieldModel(...arguments);
  }

}

module.exports = FieldModel;
