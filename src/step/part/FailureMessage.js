const GenericMessage = require('../../shared/GenericMessage');

const CSS_CLASSES = ['af-step-failure', 'af-step-message'];

class FailureMessage extends GenericMessage {

  constructor () {
    super(CSS_CLASSES);
  }

  static create () {
    return new FailureMessage(...arguments);
  }

}

module.exports = FailureMessage;
