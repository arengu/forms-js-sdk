const SDKError = require('./SDKError');

class AppError extends SDKError {

  constructor (code, message) {
    super(code, message);
  };

  static create () {
    return new AppError(...arguments);
  }

}

module.exports = AppError;
