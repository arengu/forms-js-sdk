const BaseView = require('../base/BaseView');

class FormView extends BaseView {

  constructor (model, steps, defaultStep, presenter) {
    super();

    this.formM = model;
    this.formP = presenter;

    this.stepsP = steps;

    this.currStep = this.stepsP[defaultStep];

    this.html = null;
  }

  /*
   * Internal methods
   */
  _buildForm () {
    const form = document.createElement('form');
    form.method = 'POST';

    const presenter = this.formP;
    form.onsubmit = function onSubmit (evt) {
      evt.preventDefault();
      presenter.onNext();
    };

    this.stepsP
      .map((s) => s.render())
      .forEach((n) => form.appendChild(n));

    this.currStep.show();

    return form;
  }

  /*
   * View actions
   */
  build () {
    const { id } = this.formM;

    const container = document.createElement('div');
    container.classList.add(`af-form-${id}`);
    container.classList.add('af-form');

    const node = this._buildForm();
    container.appendChild(node);

    this.html = container;
  }

  navigate (index) {
    this.currStep.hide();

    this.currStep = this.stepsP[index];

    this.currStep.show();
  }

  static create () {
    return new FormView(...arguments);
  }

}

module.exports = FormView;
