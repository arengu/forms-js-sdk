const AppError = require('./AppError');

const MODEL_NAME = 'SchemaError';

class SchemaError extends AppError {

  getInvalidFields () {
    const errors = this.extra;

    const invalidFields = {};

    for (let key in errors) {
      const tokens = key.split('/');
      const errType = tokens[1];
      const fieldName = tokens[2];

      if (errType === 'formData') {
        invalidFields[fieldName] = errors[key];
      }
    }

    return invalidFields;
  }

  static matches (body) {
    return body && body.model === MODEL_NAME;
  }

  static create () {
    return new SchemaError(...arguments);
  }

}

module.exports = SchemaError;
