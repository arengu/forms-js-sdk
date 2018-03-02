function AppError (data) {
  Error.call(this, data.message);
  Object.assign(this, data);
};

AppError.prototype = Object.create(Error.prototype);

AppError.matches = function matchesModel (obj) {
  return obj && obj.model === AppError.name;
}

module.exports = AppError;
