const SDKError = require('./SDKError');

class NotFound extends SDKError {

  constructor (message) {
    super(message);
  }

  static create () {
    return new NotFound(...arguments);
  }

}

module.exports = NotFound;
