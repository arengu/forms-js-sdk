const MODEL_NAME = 'AppError';

function AppError (data) {
  Error.call(this, data.message);
  Object.assign(this, data);
};

AppError.prototype = Object.create(Error.prototype);

AppError.matches = function matchesModel (obj) {
  return obj && obj.model === MODEL_NAME;
}

module.exports = AppError;
