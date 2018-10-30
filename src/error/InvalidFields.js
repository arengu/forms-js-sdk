const SDKError = require('./SDKError');

const DEFAULT_MESSAGE = 'One or more fields are not valid';

class InvalidFields extends SDKError {

  constructor (fields) {
    super(DEFAULT_MESSAGE);
    this.fields = fields;
  }

  static create () {
    return new InvalidFields(...arguments);
  }

  static fromResponse (body) {
    const errors = body.extra;

    const invalidFields = {};

    for (let key in errors) {
      const tokens = key.split('/');
      const errType = tokens[1];
      const fieldName = tokens[2];

      if (errType === 'formData') {
        invalidFields[fieldName] = errors[key];
      }
    }

    return InvalidFields.create(invalidFields);
  }

}

module.exports = InvalidFields;
