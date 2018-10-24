const BaseView = require('../base/BaseView');

class FormView extends BaseView {

  constructor (formM, formP) {
    super();

    this.formP = formP;
    this.formM = formM;

    this.stepsV = [];

    this.node = null;
    this.html = null;
  }

  addStep (stepV) {
    this.stepsV.push(stepV);
  }

  /*
   * Internal methods
   */
  _buildForm () {
    const form = document.createElement('form');
    form.setAttribute('method', 'POST');
    form.setAttribute('novalidate', 'novalidate');

    const self = this;
    form.onsubmit = function onSubmit (evt) {
      evt.preventDefault();
      self.formP.onSubmitForm();
    };

    this.stepsV
      .forEach((sN) => form.appendChild(sN));
    
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

    this.node = node;
    this.html = container;
  }

  reset () {
    this.node.reset();
  }

  static create () {
    return new FormView(...arguments);
  }

}

module.exports = FormView;
