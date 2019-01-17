const SDKError = require('./SDKError');

class ValidationError extends SDKError {

  constructor (code, message) {
    super(code, message);
  };

  static create (...args) {
    return new ValidationError(...args);
  }

}

module.exports = ValidationError;
