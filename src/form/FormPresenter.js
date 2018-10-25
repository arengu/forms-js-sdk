const FormView = require('./FormView');
const MetaData = require('./MetaData');

const SubmitForm = require('./interactor/SubmitForm');

const BasePresenter = require('../base/BasePresenter');

const StepPresenter = require('../step/StepPresenter');

const InvalidFields = require('../error/InvalidFields');

const FIRST_STEP = 0;

class FormPresenter extends BasePresenter {

  constructor (formM, hiddenFields) {
    super();

    this.formM = formM;

    this.stepsP = formM.steps
      .map((sM) => StepPresenter.create(sM, formM, this));

    this.formV = FormView.create(formM, this);
    this.stepsP
      .map((sV) => sV.render())
      .forEach((sV) => this.formV.addStep(sV));

    this.hiddenFields = hiddenFields;

    this.indexCurrStep = null;
  }

  /*
   * Internal methods
   */
  redirectUser (url, delayS) {
    const delayMS = delayS * 1000;
    setTimeout(() => {
      window.location = url;
    }, delayMS);
  }

  getFormValues () {
    const valuesPerStep = this.stepsP.map((sP) => sP.getStepData());
    const values = Object.assign({}, ...valuesPerStep);

    return values;
  }

  /**
   *Public methods
   */

  getFormId () {
    return this.formM.id;
  }

  /*
   * Step events
   */
  onPreviousStep (stepP, stepM) {
    if (this.hasPreviousStep()) {
      this.goPreviousStep();
    }
  }

  onSubmitForm () {
    const currStepP = this.stepsP[this.indexCurrStep];
    currStepP.onGoNext();
  }

  _handleOnSubmit (res, stepP) {
    if (res.message) {
      stepP.onSuccess(res.message);
    }

    if (res.target) {
      this.redirectUser(res.target, res.delay);
    }
  }

  async _submitForm (stepP) {
    const formId = this.formM.id;
    const submission = {
      formData: Object.assign({}, this.getFormValues(), this.hiddenFields.getAll()),
      metaData: MetaData.getAll(),
    };

    try {
      const res = await SubmitForm.execute(formId, submission);
      this._handleOnSubmit(res, stepP);
    } catch (err) {
      if (err instanceof InvalidFields) {
        this.stepsP.forEach((sP) => sP.onSeveralInvalidFields(err.fields));
      } else {
        stepP.onError(err.message);
      }
    }
  }

  async onNextStep (stepP, stepM) {
    if (this.hasNextStep()) {
      this.goNextStep();
      return;
    }

    stepP.disable();
    stepP.showLoading();

    await this._submitForm(stepP);

    stepP.enable();
    stepP.hideLoading();
  }

  /*
   * Form actions
   */
  resetForm () {
    return this.formV.reset();
  }

  _goToStep (index) {
    const currStepP = this.stepsP[this.indexCurrStep];
    const newStepP = this.stepsP[index]

    this.indexCurrStep = index;

    if (currStepP) {
      currStepP.hide();
    }
    if (newStepP) {
      newStepP.show();
    }
  }

  render () {
    this._goToStep(FIRST_STEP);
    return this.formV.render();
  }

  hasPreviousStep () {
    return this.stepsP[this.indexCurrStep - 1];
  }
  hasNextStep () {
    return this.stepsP[this.indexCurrStep + 1];
  }

  goPreviousStep () {
    this._goToStep(this.indexCurrStep - 1);
  }

  goNextStep () {
    this._goToStep(this.indexCurrStep + 1);
  }

  static create () {
    return new FormPresenter(...arguments);
  }

}

module.exports = FormPresenter;
