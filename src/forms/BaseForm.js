const errorUtils = require('./error-utils');
const htmlUtils = require('../view/html-utils');

const SchemaError = require('../models/SchemaError');

class BaseForm {

  constructor (sdk, formId) {
    this.formId = formId;

    this.model = null;
    this.comp = null;

    this.repository = sdk.repository;
    this.compFactory = sdk.compFactory;
  }

  _handleOnSubmit (os) {
    switch (os.action) {
      case 'redirect':
        location = os.target;
        break;

      case 'message':
        this.comp.setSuccess(os.message);
    }
  }

  _submit (submission) {
    const { formId, formData } = submission;

    return this.repository.createSubmission(submission)
      .then((confirmation) => {
        console.log(`Submission registered with id [${confirmation.id}]`);
        htmlUtils.triggerEvent('rf-submitSuccess', submission);

        this._handleOnSubmit(confirmation.onSubmit);

        return submission;
      })
      .catch((err) => {
        if (err instanceof SchemaError) {
          console.error(`Error validating data:`, err.extra);
          const invalidFields = errorUtils.getInvalidFields(err);
          this.comp.setInvalidFields(invalidFields);
          htmlUtils.triggerEvent('rf-invalidFields', invalidFields);

        } else {
          const errMessage = err.message;
          console.error(`Error sending submission:`, errMessage);
          this.comp.setFormError(errMessage);
          htmlUtils.triggerEvent('rf-submitError', errMessage);
        }

        throw err;
      });
  }

  beforeSubmit (submission) {
    htmlUtils.triggerEvent('rf-beforeSubmit', submission);
  }

  afterSubmit (error, submission) {
    htmlUtils.triggerEvent('rf-afterSubmit', submission);
  }

  _onSubmit (data) {
    const submission = {
      formId: this.formId,
      metaData: {},
      formData: data
    };

    this.comp.disable();
    this.comp.clearState();

    this.beforeSubmit(submission);

    return this._submit(submission)
      .then(() => this.afterSubmit(null, submission))
      .catch((err) => this.afterSubmit(err))
      .then(() => this.comp.enable());
  }

  _init () {
    return this.repository.getForm(this.formId)
      .then((formModel) => {
        this.model = formModel;
        this.comp = this.compFactory.form(formModel, this._onSubmit.bind(this));
      });
  }

}

module.exports = BaseForm;
