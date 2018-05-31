const AppError = require('./AppError');

const MODEL_NAME = 'SchemaError';

class SchemaError extends AppError {

  constructor (body) {
    super(body);
  };

  static matches (body) {
    return body && body.model === MODEL_NAME;
  }

}

module.exports = SchemaError;
