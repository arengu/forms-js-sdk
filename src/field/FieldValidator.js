const Validator = require('../lib/Validator');

class FieldValidator {

  /**
   * Validate Form Fields
   * @param field
   * @returns {Array}
   */
  static validate (model, value) {
    try {
      if(model.required){
        Validator.validateRequire(value);
      }

      if(model.config.minLength){
        Validator.validateMinLength(value, model.config.minLength);
      }

      if(model.config.maxLength){
        Validator.validateMaxLength(value, model.config.maxLength);
      }

      switch (model.type) {
        case 'email':
          Validator.validateEmail(value);
          break;

        case 'number':
          Validator.validateNumber(value);
          break;

        case 'boolean':
          Validator.validateBoolean(value);
          break;

        case 'url':
          Validator.validateUrl(value);
          break;
      }

    } catch (e) {
      return e.message;
    }
  }


}

module.exports = FieldValidator;
