const BaseView = require('../base/BaseView');

const FailureMessage = require('./part/FailureMessage');
const NextButton = require('./part/NextButton');
const SuccessMessage = require('./part/SuccessMessage');

class StepView extends BaseView {

  constructor (model, components, presenter) {
    super();

    this.stepM = model;
    this.componentsP = components;
    this.stepP = presenter;

    this.successV = null;
    this.errorV = null;
    this.submitV = null;

    this.html = null;
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

    this.submitV = NextButton.create(buttons.next);
    container.appendChild(this.submitV.render());

    return container;
  }

  /*
   * View actions
   */
  build () {
    const { id } = this.stepM;

    const container = document.createElement('div');
    container.classList.add(`af-step-${id}`);
    container.classList.add('af-step');

    this.componentsP
      .map((cp) => cp.render())
      .forEach((n) => container.appendChild(n));

    container.appendChild(this._buildMessage());

    container.appendChild(this._buildNavigation());

    this.html = container;
  }

  show () {
    this.html.style.display = 'initial';
  }

  hide () {
    this.html.style.display = 'none';
  }

  enable () {
    this.submitV.enable();
  }

  disable () {
    this.submitV.disable();
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

  setError (msg) {
    return this.errorV.setText(msg);
  }

  static create () {
    return new StepView(...arguments);
  }

}

module.exports = StepView;
