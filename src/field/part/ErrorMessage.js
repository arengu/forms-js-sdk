const GenericMessage = require('../../shared/GenericMessage');

const CSS_CLASSES = ['af-field-error', 'af-field-message'];

class ErrorMessage extends GenericMessage {

  constructor () {
    super(CSS_CLASSES);
  }

  static create () {
    return new ErrorMessage(...arguments);
  }

}

module.exports = ErrorMessage;
