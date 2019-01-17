const BaseModel = require('../base/BaseModel');

let UID = 0;

class FieldModel extends BaseModel {

  constructor (data) {
    super(data);
    this.id = data.id;
    this.uid = this._getUID(this.id);
    this.label = data.label;
    this.hint = data.hint;
    this.placeholder = data.placeholder;
    this.type = data.type;
    this.required = data.required;
    this.config = data.config;
  }

  static create (...args) {
    return new FieldModel(...args);
  }

  _getUID (id) {
    UID++;
    return `${id}-${UID}`;
  }

}

module.exports = FieldModel;
