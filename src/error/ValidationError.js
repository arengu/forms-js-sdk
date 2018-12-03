const SDKError = require('./SDKError');

class ValidationError extends SDKError {

  constructor (code, message) {
    super(code, message);
  };

  static create () {
    return new ValidationError(...arguments);
  }

}

module.exports = ValidationError;
