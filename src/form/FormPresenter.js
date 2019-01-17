const FormView = require('./FormView');
const MetaData = require('./MetaData');

const SubmitForm = require('./interactor/SubmitForm');
const ValidateStep = require('./interactor/ValidateStep');

const BasePresenter = require('../base/BasePresenter');

const StepPresenter = require('../step/StepPresenter');

const InvalidFields = require('../error/InvalidFields');

const SignatureStack = require('../lib/SignatureStack');

const FIRST_STEP = 0;

class FormPresenter extends BasePresenter {

  constructor (formM, hiddenFields, messages) {
    super();

    this.formM = formM;

    this.stepsP = formM.steps
      .map((sM) => StepPresenter.create(sM, formM, this, messages));

    this.formV = FormView.create(formM, this);
    this.stepsP
      .map((sV) => sV.render())
      .forEach((sV) => this.formV.addStep(sV));

    this.hiddenFields = hiddenFields;

    this.signatures = SignatureStack.create();

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
      stepP.removeSuccess();
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

  async _validateStep (stepM) {
    if (!ValidateStep.required(stepM)) {
      return;
    }

    const formId = this.formM.id;
    const data = Object.assign({}, this.getFormValues(), this.hiddenFields.getAll());
    const signature = this.signatures.get();

    const body = await ValidateStep.execute(formId, stepM, data, signature);

    this.signatures.set(body.signature);
  }

  async _submitForm (stepP) {
    const formId = this.formM.id;
    const submission = {
      formData: Object.assign({}, this.getFormValues(), this.hiddenFields.getAll()),
      metaData: MetaData.getAll(),
    };
    const signature = this.signatures.get(true);

    const res = await SubmitForm.execute(formId, submission, signature);
    this._handleOnSubmit(res, stepP);
  }

  async onNextStep (stepP, stepM) {
    stepP.disable();
    stepP.showLoading();

    try {
      await this._validateStep(stepM);

      if (this.hasNextStep()) {
        this.goNextStep();
      } else {
        await this._submitForm(stepP);
        this.stepsP
          .forEach((sP) => sP.resetForm());
      }
    } catch (err) {
      if (err instanceof InvalidFields) {
        this.stepsP.forEach((sP) => sP.onSeveralInvalidFields(err));
      } else {
        stepP.onError(err);
      }
    } finally {
      stepP.enable();
      stepP.hideLoading();
    }
  }

  /*
   * Form actions
   */

  _goToStep (index) {
    const currStepP = this.stepsP[this.indexCurrStep];
    const newStepP = this.stepsP[index];

    this.indexCurrStep = index;

    this.signatures.goto(index);

    if (currStepP) {
      currStepP.hide();
    }
    if (newStepP) {
      newStepP.show();
    }
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

  goFirstStep () {
    this._goToStep(FIRST_STEP);
  }

  static create (...args) {
    return new FormPresenter(...args);
  }

  render () {
    this.goFirstStep();
    return this.formV.render();
  }
}

module.exports = FormPresenter;
