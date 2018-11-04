const SDKError = require('./SDKError');

const DEFAULT_MESSAGE = 'One or more fields are not valid';

const FieldErrorCode = {
  ERR_REQUIRED_PROPERTY: 'ERR_REQUIRED_PROPERTY',
  ERR_TOO_SHORT_STRING: 'ERR_TOO_SHORT_STRING',
  ERR_TOO_LONG_STRING: 'ERR_TOO_LONG_STRING',
  ERR_EMAIL_EXPECTED: 'ERR_EMAIL_EXPECTED',
  ERR_URL_EXPECTED: 'ERR_URL_EXPECTED',
  ERR_INTEGER_EXPECTED: 'ERR_INTEGER_EXPECTED',
  INVALID_BOOLEAN: 'ERR_BOOLEAN_EXPECTED',
  INVALID_NUMBER: 'ERR_NUMBER_EXPECTED',
};

class FieldError extends SDKError {

  constructor (code, message, details) {
    super(message);
    this.code = code;
    this.details = details;
  }

  static get CODE () {
    return FieldErrorCode;
  }

  static create (message, code, details) {
    return new FieldError(message, code, details);
  }

  static fromPropertyError (data) {
    return new FieldError(
      data.code,
      data.message,
      data.details,
    );
  }

}

class InvalidFields extends SDKError {

  constructor (fields) {
    super(DEFAULT_MESSAGE);
    this.fields = fields;
  }

  static get FieldError () {
    return FieldError;
  }

  static get EXPECTED_ERROR () {
    return 'ERR_INVALID_INPUT';
  }

  static fromFields (fields) {
    const self = InvalidFields;

    return new self(fields);
  }

  static fromSchemaError (schemaErr) {
    const self = InvalidFields;

    const invalidProps = schemaErr.details.invalidProperties;

    const invalidFields = {};

    invalidProps
      .forEach((propErr) => {
        const tokens = propErr.path.split('/');
        const errType = tokens[1];

        if (errType !== 'formData') {
          return;
        }

        const fieldId = tokens[2];

        invalidFields[fieldId] = FieldError.fromPropertyError(propErr);
      });

    return self.fromFields(invalidFields);
  }

}

module.exports = InvalidFields;
