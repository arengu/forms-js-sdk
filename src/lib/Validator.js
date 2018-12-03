const { FieldError } = require('../error/InvalidFields');
const { DEFAULT_MESSAGES } = require('./Messages');

const { CODE } = FieldError;

const EMAIL_REGEX = /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i;
const URI_REGEX = /^(?:(?:http[s\u017F]?|ftp):\/\/)(?:(?:[\0-\x08\x0E-\x1F!-\x9F\xA1-\u167F\u1681-\u1FFF\u200B-\u2027\u202A-\u202E\u2030-\u205E\u2060-\u2FFF\u3001-\uD7FF\uE000-\uFEFE\uFF00-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])+(?::(?:[\0-\x08\x0E-\x1F!-\x9F\xA1-\u167F\u1681-\u1FFF\u200B-\u2027\u202A-\u202E\u2030-\u205E\u2060-\u2FFF\u3001-\uD7FF\uE000-\uFEFE\uFF00-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])*)?@)?(?:(?!10(?:\.[0-9]{1,3}){3})(?!127(?:\.[0-9]{1,3}){3})(?!169\.254(?:\.[0-9]{1,3}){2})(?!192\.168(?:\.[0-9]{1,3}){2})(?!172\.(?:1[6-9]|2[0-9]|3[01])(?:\.[0-9]{1,3}){2})(?:[1-9][0-9]?|1[0-9][0-9]|2[01][0-9]|22[0-3])(?:\.(?:1?[0-9]{1,2}|2[0-4][0-9]|25[0-5])){2}(?:\.(?:[1-9][0-9]?|1[0-9][0-9]|2[0-4][0-9]|25[0-4]))|(?:(?:(?:[0-9KSa-z\xA1-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])+-?)*(?:[0-9KSa-z\xA1-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])+)(?:\.(?:(?:[0-9KSa-z\xA1-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])+-?)*(?:[0-9KSa-z\xA1-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])+)*(?:\.(?:(?:[KSa-z\xA1-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]){2,})))(?::[0-9]{2,5})?(?:\/(?:[\0-\x08\x0E-\x1F!-\x9F\xA1-\u167F\u1681-\u1FFF\u200B-\u2027\u202A-\u202E\u2030-\u205E\u2060-\u2FFF\u3001-\uD7FF\uE000-\uFEFE\uFF00-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])*)?$/i;
const INTEGER_REGEX = /^(-?[1-9]+\d*)$|^0$/;
const BOOLEAN_REGEX = /^(true|false)$/;
const NUMBER_REGEX = /^\d+(\.\d+)?$/;

class Validator {

  /**
   * Validate require field
   * @param value
   * @returns {String, null}
   */
  static validateRequire (value) {
    if (value === null || !value.length) {
      throw FieldError.create(
        CODE.ERR_REQUIRED_PROPERTY,
        'This field is required',
      );
    }

    return true;
  }

  /**
   * Validate the minimum length
   * @param value
   * @param length
   * @returns {String, null}
   */
  static validateMinLength (value, length) {
    if (value && value.length < length){
      throw FieldError.create(
        CODE.ERR_TOO_SHORT_STRING,
        `This field must be at least ${length} character(s)`,
        { minLength: length },
      );
    }

    return true;
  }

  /**
   * Validate the maximum length
   * @param value
   * @param length
   * @returns {String, null}
   */
  static validateMaxLength (value, length) {
    if (value && value.length > length){
      throw FieldError.create(
        CODE.ERR_TOO_LONG_STRING,
        `This field must be less or equal to ${length} character(s)`,
        { maxLength: length },
      );
    }

    return true;
  }

  /**
   * Validate email type
   * @param value
   * @returns {*}
   */
  static validateEmail (value) {
    if(!EMAIL_REGEX.test(value)){
      throw FieldError.create(
        CODE.ERR_EMAIL_EXPECTED,
        'Email is not valid',
      );
    }

    return true;
  }

  /**
   * Validate uri
   * @param value
   * @returns {*}
   */
  static validateUrl (value) {
    if(!URI_REGEX.test(value)){
      throw FieldError.create(
        CODE.ERR_URL_EXPECTED,
        'URL is not valid',
      );
    }

    return true;
  }

  /**
   * Validate Integer type
   * @param value
   * @returns {*}
   */
  static validateInteger (value) {
    if(!INTEGER_REGEX.test(value)){
      throw FieldError.create(
        CODE.ERR_INTEGER_EXPECTED,
        'Enter a valid integer value',
      );
    }

    return true;
  }

  /**
   * Validate Boolean Type
   * @param value
   * @returns {*}
   */
  static validateBoolean (value) {
    if(!BOOLEAN_REGEX.test(value)){
      throw FieldError.create(
        CODE.INVALID_BOOLEAN,
        'Enter a valid boolean value',
      );
    }

    return true;
  }

  /**
   * Validate Number
   * @param value
   * @returns {*}
   */
  static validateNumber (value) {
    if(!NUMBER_REGEX.test(value)){
      throw FieldError.create(
        CODE.INVALID_NUMBER,
        'Enter a valid number',
      );
    }

    return true;
  }

  static validateFormat(fieldType, value) {
    if (!value) {
      return true;
    }

    switch (fieldType) {
      case 'EMAIL':
        return Validator.validateEmail(value);

      case 'NUMBER':
        return Validator.validateNumber(value);

      case 'BOOLEAN':
        return Validator.validateBoolean(value);

      case 'URL':
        return Validator.validateUrl(value);

      default:
        return true;
    }
  }

}

module.exports = Validator;
