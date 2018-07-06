const GenericMessage = require('../../shared/GenericMessage');

const CSS_CLASSES = ['af-step-success', 'af-step-message'];

class SuccessMessage extends GenericMessage {

  constructor () {
    super(CSS_CLASSES);
  }

  static create () {
    return new SuccessMessage(...arguments);
  }

}

module.exports = SuccessMessage;
