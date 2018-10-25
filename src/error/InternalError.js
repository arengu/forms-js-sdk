const SDKError = require('./SDKError');

class InternalError extends SDKError {

  static create () {
    return new InternalError(...arguments);
  }

}

module.exports = InternalError;
