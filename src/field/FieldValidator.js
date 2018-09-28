const Validator = require('../lib/Validator');

class FieldValidator {

  /**
   * Validate Form Fields
   * @param field
   * @returns {Array}
   */
  static validate (model, value) {

    try {
      if (model.required) {
        Validator.validateRequire(value);
      }

      if (model.config.minLength) {
        Validator.validateMinLength(value, model.config.minLength);
      }

      if (model.config.maxLength) {
        Validator.validateMaxLength(value, model.config.maxLength);
      }

      Validator.validateFormat(model.type, value);

    } catch (e) {
      return e.message;
    }
  }


}

module.exports = FieldValidator;
