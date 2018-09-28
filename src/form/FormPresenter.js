const BasePresenter = require('../base/BasePresenter');
const FormView = require('./FormView');

const FormInteractor = require('./FormInteractor');

const StepPresenter = require('../step/StepPresenter');

const DEFAULT_STEP = 0;

class FormPresenter extends BasePresenter {

  constructor (model) {
    super();

    this.formM = model;
    this.formI = FormInteractor.create();

    this.stepsP = model.steps.map((s) => StepPresenter.create(s, this));

    this.formV = FormView.create(model, this.stepsP, DEFAULT_STEP, this);

    this.currStep = DEFAULT_STEP;
  }

  /*
   * Internal methods
   */
  _enableForm () {
    this.stepsP[this.currStep].enable();
  }

  _disableForm () {
    this.stepsP[this.currStep].disable();
  }

  _showLoading () {
    this.stepsP[this.currStep].showLoading();
  }

  _hideLoading () {
    this.stepsP[this.currStep].hideLoading();
  }

  _isFirstStep () {
    return this.currStep === 0;
  }

  _isLastStep () {
    return (this.currStep + 1) === this.stepsP.length;
  }

  _setInvalidFields (invalidFields) {
    this.stepsP.forEach((sp) => sp.onInvalidStep(invalidFields));
  }

  _setFormError (msg) {
    const current = this.stepsP[this.currStep];
    current.onError(msg);
  }

  _setFormSuccess (msg) {
    const current = this.stepsP[this.currStep];
    current.onSuccess(msg);
  }

  _redirectUser (url) {
    window.location = url;
  }

  _getFormData () {
    return this.stepsP.reduce((data, p) => {
      return Object.assign(data, p.getStepData());
    }, {});
  }

  _submit () {
    const formId = this.formM.id;
    const data = this._getFormData();
    const meta = this.formV.getMetaData();

    this._disableForm();
    this._showLoading();

    this.formI.submit(formId, data, meta, this);
  }

  _handleOnSubmit (os) {
    switch (os.action) {
      case 'redirect':
        this._redirectUser(os.target);
        break;

      case 'message':
        this._setFormSuccess(os.message);
    }
  }

  /*
   * Submit events
   */
  onSuccess (conf) {
    this._enableForm();
    this._hideLoading();

    this.formReset();

    this._handleOnSubmit(conf.onSubmit);
  }

  onInvalidFields (invalidFields) {
    this._setInvalidFields(invalidFields);

    this._enableForm();
    this._hideLoading();
  }

  onFormError (msg) {
    this._setFormError(msg);

    this._enableForm();
    this._hideLoading();
  }

  /*
   * Step events
   */
  onBack () {
    if (!this._isFirstStep()) {
      this.goBack();
    }
  }

  onNext () {
    const errors = this.stepsP[this.currStep].validate();

    if (Object.keys(errors).length) {
      console.error(`Error validating data:`, errors);
      this.stepsP[this.currStep].onInvalidStep(errors);
      return;
    }

    if (this._isLastStep()) {
      this._submit();
      this._showLoading();
    } else {
      this.goNext();
    }
  }

  /*
   * Form actions
   */
  formReset () {
    return this.formV.reset();
  }

  render () {
    return this.formV.render();
  }

  goBack () {
    this.currStep = this.currStep - 1;
    this.formV.navigate(this.currStep);
  }

  goNext () {
    this.currStep = this.currStep + 1;
    this.formV.navigate(this.currStep);
  }

  static create () {
    return new FormPresenter(...arguments);
  }

  getModel () {
    return this.formM;
  }

}

module.exports = FormPresenter;
