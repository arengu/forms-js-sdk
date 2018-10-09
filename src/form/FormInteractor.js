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
      metaData: meta,
      formData: data,
    };

    this.eventsFactory.submitForm(formId, data);
    return this.repository.createSubmission(formId, submission)
      .then((res) => {
        this.eventsFactory.submitFormSuccess(formId, res);
        presenter.onSuccess(res);

        return res;
      })
      .catch((err) => {
        if (err instanceof SchemaError) {
          const invalidFields = err.getInvalidFields();
          console.error(`Error validating data:`, invalidFields);
          
          this.eventsFactory.invalidFieldsError(formId, invalidFields);
          presenter.onInvalidFields(invalidFields);

        } else {
          const errMessage = err._message || err.message;
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
