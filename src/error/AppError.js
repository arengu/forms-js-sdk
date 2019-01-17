const SDKError = require('./SDKError');

class AppError extends SDKError {

  constructor (code, message) {
    super(code, message);
  };

  static create (...args) {
    return new AppError(...args);
  }

}

module.exports = AppError;
