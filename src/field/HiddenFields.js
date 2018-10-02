const Utilities = require('../lib/Utilities');
const SDKError = require('../error/SDKError');

const MISSING_KEY_ERROR = 'The provided key does not belong to a hidden field';

class HiddenFields {
  constructor (fields, initValues) {
    this.fields = Utilities.indexObject(fields, 'key');
    this.data = this._initAllFields(fields, initValues);
  }

  /**
   * Private methods
   */
  _initField (field, initValues) {
    return initValues[field.key] || Utilities.getUrlParam(field.key) || field.value;
  }

  _initAllFields(fields, initValues) {
    if (!fields) {
      return {};
    }

    return fields.reduce((obj, f) => {
      obj[f.key] = this._initField(f, initValues);
      return obj;
    }, {});
  }

  /**
   * Public methods
   */
  get (key) {
    if (!this.fields[key]) {
      throw new SDKError(MISSING_KEY_ERROR)
    }

    return this.data[key];
  }

  set (key, value) {
    if (!this.fields[key]) {
      throw new SDKError(MISSING_KEY_ERROR)
    }

    this.data[key] = value;
  }

  getAll () {
    return this.data;
  }

  static create() {
    return new HiddenFields(...arguments);
  }
}

module.exports = HiddenFields;
