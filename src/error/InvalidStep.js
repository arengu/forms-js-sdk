const SDKError = require('./SDKError');

class InvalidStep extends SDKError {

  static create (...args) {
    return new InvalidStep(...args);
  }

  static fromResponse (body) {
    return InvalidStep.create(body.code, body.message);
  }

}

module.exports = InvalidStep;
