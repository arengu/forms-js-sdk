const SDKError = require('./SDKError');

class ValidationError extends SDKError {

  constructor (message) {
    super(message);
  };

  static create () {
    return new ValidationError(...arguments);
  }

}

module.exports = ValidationError;
