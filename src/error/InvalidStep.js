const SDKError = require('./SDKError');

class InvalidStep extends SDKError {

  static create () {
    return new InvalidStep(...arguments);
  }

}

module.exports = InvalidStep;
