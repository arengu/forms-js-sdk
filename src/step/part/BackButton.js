const GenericButton = require('../../shared/GenericButton');

const CSS_CLASSES = ['af-step-back', 'af-step-button'];

const BUTTON_TYPE = 'button';

class BackButton extends GenericButton {

  constructor (text) {
    super(text, BUTTON_TYPE, null, CSS_CLASSES);
  }

  static create () {
    return new BackButton(...arguments);
  }

}

module.exports = BackButton;
