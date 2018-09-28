const GenericButton = require('../../shared/GenericButton');

const CSS_CLASSES = ['af-step-next', 'af-step-button'];

const BUTTON_TYPE = 'submit';

class NextButton extends GenericButton {

  constructor (text) {
    super(text, BUTTON_TYPE, null, CSS_CLASSES);
  }

  showLoading () {
    this.node.classList.add('af-button-loading');
  }

  hideLoading () {
    this.node.classList.remove('af-button-loading');
  }

  static create () {
    return new NextButton(...arguments);
  }

}

module.exports = NextButton;
