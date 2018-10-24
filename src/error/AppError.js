const SDKError = require('./SDKError');

class AppError extends SDKError {

  constructor (code, message) {
    super(message);
    this.code = code;
  };

  static create () {
    return new AppError(...arguments);
  }

}

module.exports = AppError;
