const GenericMessage = require('../../shared/GenericMessage');

const CSS_CLASSES = ['af-field-error', 'af-field-message'];

class ErrorMessage extends GenericMessage {

  constructor () {
    super(CSS_CLASSES);
  }

  static create (...args) {
    return new ErrorMessage(...args);
  }

}

module.exports = ErrorMessage;
