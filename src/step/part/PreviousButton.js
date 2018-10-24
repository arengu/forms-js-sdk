const GenericButton = require('../../shared/GenericButton');

const CSS_CLASSES = ['af-step-previous', 'af-step-button'];

const BUTTON_TYPE = 'button';

class PreviousButton extends GenericButton {

  constructor (text, stepP) {
    super(text, BUTTON_TYPE, null, CSS_CLASSES);

    this.stepP = stepP;
  }

  build () {
    super.build();

    this.node.onclick = () => this.stepP.onGoPrevious();
  }

  static create () {
    return new PreviousButton(...arguments);
  }

}

module.exports = PreviousButton;
