const GenericMessage = require('../../shared/GenericMessage');

const CSS_CLASSES = ['af-step-failure', 'af-step-message'];

class FailureMessage extends GenericMessage {

  constructor () {
    super(CSS_CLASSES);
  }

  static create (...args) {
    return new FailureMessage(...args);
  }

}

module.exports = FailureMessage;
