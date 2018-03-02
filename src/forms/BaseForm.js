const errorUtils = require('./error-utils');

class BaseForm {

  constructor (sdk, formId) {
    this.formId = formId;

    this.model = null;
    this.comp = null;

    this.repository = sdk.repository;
    this.compFactory = sdk.compFactory;
  }

  _submit (submission) {
    const { formId, formData } = submission;

    return this.repository.createSubmission(submission)
      .then((confirmation) => {
        console.log(`Submission registered with id [${confirmation.id}]`);
        this.comp.setSuccess(confirmation.message);

        return submission;
      })
      .catch((err) => {
        if (err.name === 'SchemaError') {
          console.error(`Error validating data:`, err.extra);
          const invalidFields = errorUtils.getInvalidFields(err);
          this.comp.setInvalidFields(invalidFields);

        } else {
          const errMessage = err.message;
          console.error(`Error sending submission:`, errMessage);
          this.comp.setFormError(errMessage);
        }
      });
  }

  beforeSubmit (submission) {
  }

  afterSubmit (error, submission) {
  }

  _onSubmit (data) {
    const submission = {
      formId: this.formId,
      metaData: {},
      formData: data
    };

    this.comp.disable();
    this.comp.clearErrors();

    this.beforeSubmit(submission);

    return this._submit(submission)
      .then(() => this.afterSubmit(null, submission))
      .catch((err) => this.afterSubmit(err))
      .finally(() => this.comp.enable());
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
