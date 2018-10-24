const StepView = require('./StepView');

const ValidateStep = require('./interactor/ValidateStep');

const BasePresenter = require('../base/BasePresenter');

const FieldPresenter = require('../field/FieldPresenter');

const INVALID_FIELDS_ERROR = 'One or more fields have an error. Please check and try again.';

class StepPresenter extends BasePresenter {

  constructor (stepM, formM, formP) {
    super();

    this.stepM = stepM;
    this.formP = formP;

    this.invalidFields = [];

    this.componentsP = stepM.components
      .map((cM) => FieldPresenter.create(cM, formM, this));

    this.stepV = StepView.create(stepM, this);

    this.componentsP
      .map((cP) => cP.render())
      .forEach((cV) => this.stepV.addComponent(cV));
  }

  /*
   * Step events
   */
  onSeveralInvalidFields (errors = {}) {
    this.componentsP.forEach((cp) => {
      const errMessage = errors[cp.id];

      if (errMessage) {
        cp.setError(errMessage);
      } else {
        cp.removeError();
      }
    });
  }

  onGoPrevious () {
    this.formP.onPreviousStep(this, this.stepM);
  }

  onGoNext () {
    try {
      ValidateStep.execute(this.componentsP);
      this.formP.onNextStep(this, this.stepM);
    } catch (err) {
      this.onSeveralInvalidFields(err.fields);
    }
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

  render () {
    return this.stepV.render();
  }

  showLoading () {
    this.stepV.showLoading();
  }

  hideLoading () {
    this.stepV.hideLoading();
  }

  enable () {
    this.stepV.enable();
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
