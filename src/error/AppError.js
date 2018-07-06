const SDKError = require('./SDKError');

const MODEL_NAME = 'AppError';

class AppError extends SDKError {

  constructor (body) {
    super(body.message);
    this.status = body.status;
    this.extra = body.extra;
  };

  static matches (body) {
    return body && body.model === MODEL_NAME;
  }

  static create () {
    return new AppError(...arguments);
  }

}

module.exports = AppError;
