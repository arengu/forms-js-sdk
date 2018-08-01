const SchemaError = require('../error/SchemaError');
const BaseInteractor = require('../base/BaseInteractor');

const HTTPClient = require('../repository/HTTPClient');
const EventsFactory = require('../lib/EventsFactory');

class FormInteractor extends BaseInteractor {

  constructor () {
    super();

    this.repository = HTTPClient.create();
    this.eventsFactory = EventsFactory.create();
    this.repository = HTTPClient.create();
  }

  /*
   * Interactor actions
   */
  submit (formId, data, meta, presenter) {
    const submission = {
      formId: formId,
      metaData: meta,
      formData: data,
    };

    this.eventsFactory.submitForm(formId, data);
    return this.repository.createSubmission(submission)
      .then((conf) => {
        this.eventsFactory.submitFormSuccess(formId, conf);
        presenter.onSuccess(conf);

        return conf;
      })
      .catch((err) => {
        if (err instanceof SchemaError) {
          const invalidFields = err.getInvalidFields();
          console.error(`Error validating data:`, invalidFields);
          
          this.eventsFactory.invalidFieldsError(formId, invalidFields);
          presenter.onInvalidFields(invalidFields);

        } else {
          const errMessage = err.message;
          console.error(`Error sending submission:`, errMessage);

          this.eventsFactory.submitFormError(formId, err);
          presenter.onFormError(errMessage);
        }

        throw err;
      });
  }

  static create () {
    return new FormInteractor(...arguments);
  }

}

module.exports = FormInteractor;
