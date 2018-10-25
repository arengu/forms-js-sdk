const SDKError = require('./SDKError');

class Forbidden extends SDKError {

  constructor (message) {
    super(message);
  }

  static create () {
    return new Forbidden(...arguments);
  }

}

module.exports = Forbidden;
