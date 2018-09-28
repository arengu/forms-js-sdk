const BasePresenter = require('../base/BasePresenter');
const StepView = require('./StepView');

const FieldPresenter = require('../field/FieldPresenter');

const INVALID_FIELDS_ERROR = 'One or more fields have an error. Please check and try again.';

class StepPresenter extends BasePresenter {

  constructor (model, form) {
    super();

    this.stepM = model;
    this.formP = form;

    this.invalidFields = [];

    this.componentsP = model.components.map((c) => FieldPresenter.create(c, form.getModel(), this));
    this.stepV = StepView.create(model, this.componentsP, this);
  }

  /*
   * Step events
   */
  onBack () {
    this.formP.onBack();
  }

  onNext () {
    this.formP.onNext();
  }

  onInvalidStep (errors = {}) {
    this.componentsP.forEach((cp) => {
      const errMessage = errors[cp.id];

      if (errMessage) {
        cp.setError(errMessage);
      } else {
        cp.removeError();
      }
    });
  }

  onInvalidField (error, fieldPresenter) {
    const exists = this.invalidFields.includes(fieldPresenter.id);

    if (!exists) {
      if (!this.invalidFields.length) {
        this.setError(INVALID_FIELDS_ERROR);
      }

      this.invalidFields.push(fieldPresenter.id);
    }
  }

  onValidField (fieldPresenter) {
    const index = this.invalidFields.indexOf(fieldPresenter.id);

    if (index >= 0) {
      this.invalidFields.splice(index, 1);
    }

    if (!this.invalidFields.length) {
      this.removeError();
    }
  }

  onSuccess (msg) {
    return this.setSuccess(msg);
  }

  onError (msg) {
    return this.setError(msg);
  }

  /*
   * Step actions
   */

  setSuccess (msg) {
    this.removeError();
    return this.stepV.setSuccess(msg);
  }

  removeSuccess () {
    return this.stepV.removeSuccess(null);
  }

  setError (msg) {
    this.removeSuccess();
    return this.stepV.setError(msg);
  }

  removeError () {
    return this.stepV.removeError();
  }

  getStepData () {
    const data = {};

    this.componentsP.forEach((c) => {
      const { id, value } = c;

      if (value && value.length > 0) {
        data[id] = value;
      }
    });

    return data;
  }

  validate () {
    const errors = {};

    this.componentsP.forEach((c) => {
      const error = c.validate();
      if (error) {
        errors[c.id] = error;
      }
    });

    return errors;
  }

  render () {
    return this.stepV.render();
  }

  enable () {
    this.stepV.enable();
  }

  showLoading () {
    this.stepV.showLoading();
  }

  hideLoading () {
    this.stepV.hideLoading();
  }

  disable () {
    this.stepV.disable();
  }

  show () {
    this.stepV.show();
  }

  hide () {
    this.stepV.hide();
  }

  static create () {
    return new StepPresenter(...arguments);
  }

}

module.exports = StepPresenter;
