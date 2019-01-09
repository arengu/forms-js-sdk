const StepView = require('./StepView');

const ValidateStep = require('./interactor/ValidateStep');

const BasePresenter = require('../base/BasePresenter');

const FieldPresenter = require('../field/FieldPresenter');

const PaymentPresenter = require('../field/PaymentPresenter');

const InvalidFields = require('../error/InvalidFields');

const InvalidStep = require('../error/InvalidStep');

const ErrorCodes = require('../error/ErrorCodes');

const Messages = require('../lib/Messages');

const { DEFAULT_MESSAGES } = Messages;


const INVALID_FIELDS_ERROR = ErrorCodes.ERR_INVALID_INPUT;

const INVALID_FIELDS_ERROR_MSG = DEFAULT_MESSAGES.ERR_INVALID_INPUT;

const PAYMENT_FIELD_TYPE = 'PAYMENT';

class StepPresenter extends BasePresenter {

  constructor (stepM, formM, formP, messages) {
    super();

    this.stepM = stepM;
    this.formP = formP;

    this.invalidFields = [];

    this.messages = messages;

    this.componentsP = stepM.components
      .map((cM) => FieldPresenter.create(cM, formM, this, messages));

    this.stepV = StepView.create(stepM, this);

    this.componentsP
      .map((cP) => cP.render())
      .forEach((cV) => this.stepV.addComponent(cV));

    this.paymentsP = this.componentsP
      .filter((o) => o.fieldM.type === PAYMENT_FIELD_TYPE);
  }

  /*
   * Step events
   */

  /**
   * @param {InvalidFields} error
   */
  onSeveralInvalidFields (error) {
    const { fields } = error;
    const messages = this.messages;

    this.componentsP
      .forEach((cP) => {
        const err = fields[cP.id];

        if (err) {
          cP.setError(messages.getErrorMessage(err));
        } else {
          cP.removeError();
        }
      });
  }

  onGoPrevious () {
    this.formP.onPreviousStep(this, this.stepM);
  }

  async createPaymentTokens() {
    const errors = {};
    const promises = this.paymentsP
      .map((pP) => PaymentPresenter.createToken(pP)
        .catch((err) => {
          errors[pP.id] = err;
        }));

    await Promise.all(promises);
    
    if (Object.keys(errors).length) {
      throw InvalidFields.fromFields(errors);
    }
  }

  async onGoNext () {
    try {
      ValidateStep.execute(this.componentsP);
      if (this.paymentsP.length) {
        this.showLoading();
        await this.createPaymentTokens();
      }
      this.formP.onNextStep(this, this.stepM);
    } catch (err) {
      this.hideLoading();
      if (err instanceof InvalidFields) {
        this.onSeveralInvalidFields(err);
      } else {
        this.onError(err);
      }
    }
  }

  onInvalidField (error, fieldPresenter) {
    const exists = this.invalidFields.includes(fieldPresenter.id);

    if (!exists) {
      if (!this.invalidFields.length) {
        const stepError = InvalidStep.create(
          INVALID_FIELDS_ERROR,
          INVALID_FIELDS_ERROR_MSG,
        );

        this.setError(this.messages.getErrorMessage(stepError));
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

  onError (error) {
    const msg = this.messages.getErrorMessage(error);
    return this.setError(msg);
  }

  /*
   * Step actions
   */

  resetForm () {
    this.componentsP.forEach((cV) => cV.reset());
  }

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
