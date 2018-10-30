const BaseView = require('../base/BaseView');

const FailureMessage = require('./part/FailureMessage');
const NextButton = require('./part/NextButton');
const PreviousButton = require('./part/PreviousButton');
const SuccessMessage = require('./part/SuccessMessage');

class StepView extends BaseView {

  constructor (stepM, stepP) {
    super();

    this.stepM = stepM;
    this.stepP = stepP;

    this.compsV = [];
    this.successV = null;
    this.errorV = null;
    this.previousV = null;
    this.nextV = null;

    this.html = null;
  }

  addComponent (fieldV) {
    this.compsV.push(fieldV);
  }

  /*
   * Internal methods
   */
  _buildMessage () {
    const container = document.createElement('div');
    container.classList.add('af-step-messages');

    this.successV = SuccessMessage.create();
    container.appendChild(this.successV.render());

    this.errorV = FailureMessage.create();
    container.appendChild(this.errorV.render());

    return container;
  }

  _buildNavigation () {
    const { buttons } = this.stepM;

    const container = document.createElement('div');
    container.classList.add('af-step-navigation');

    if (buttons.previous) {
      this.previousV = PreviousButton.create(buttons.previous, this.stepP);
      container.appendChild(this.previousV.render());
    }

    this.nextV = NextButton.create(buttons.next);
    container.appendChild(this.nextV.render());

    return container;
  }

  /*
   * View actions
   */
  build () {
    const { id } = this.stepM;

    const container = document.createElement('div');
    container.classList.add(`af-step-${id}`);
    container.classList.add('af-step-hide');
    container.classList.add('af-step');

    this.compsV
      .forEach((fV) => container.appendChild(fV));

    container.appendChild(this._buildMessage());

    container.appendChild(this._buildNavigation());

    this.html = container;
  }

  show () {
    this.html.classList.add('af-step-current');
    this.html.classList.remove('af-step-hide');
  }

  hide () {
    this.html.classList.remove('af-step-current');
    this.html.classList.add('af-step-hide');
  }

  enable () {
    this.nextV.enable();
  }

  disable () {
    this.nextV.disable();
  }

  showLoading () {
    this.nextV.showLoading();
  }

  hideLoading () {
    this.nextV.hideLoading();
  }

  setInvalidFields (errors = {}) {
    this.compComps.forEach((f) => {
      const errMessage = errors[f.id];
      f.setError(errMessage)
    });
  }

  setSuccess (msg) {
    return this.successV.setText(msg);
  }

  removeSuccess () {
    return this.successV.removeText();
  }

  setError (msg) {
    return this.errorV.setText(msg);
  }

  removeError () {
    return this.errorV.removeText();
  }

  static create () {
    return new StepView(...arguments);
  }

}

module.exports = StepView;
