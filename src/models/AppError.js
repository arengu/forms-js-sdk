const MODEL_NAME = 'AppError';

class AppError extends Error {

  constructor (body) {
    super(body.message);
    this.status = body.status;
    this.extra = body.extra;
  };

  static matches (body) {
    return body && body.model === MODEL_NAME;
  }

}

module.exports = AppError;
