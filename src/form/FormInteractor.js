const SchemaError = require('../error/SchemaError');
const InvalidStep = require('../error/InvalidStep');
const BaseInteractor = require('../base/BaseInteractor');

const Repository = require('../repository/HTTPClient');
const EventsFactory = require('../lib/EventsFactory');

class FormInteractor extends BaseInteractor {

  /*
   * Interactor actions
   */
  static submit (formId, data, meta, presenter) {
    const submission = {
      metaData: meta,
      formData: data,
    };

    EventsFactory.submitForm(formId, data);
    return Repository.createSubmission(formId, submission)
      .then((res) => {
        EventsFactory.submitFormSuccess(formId, res);
        presenter.onSuccess(res);

        return res;
      })
      .catch((err) => {
        if (err instanceof SchemaError) {
          const invalidFields = err.getInvalidFields();
          console.error(`Error validating data:`, invalidFields);

          EventsFactory.invalidFieldsError(formId, invalidFields);
          presenter.onInvalidFields(invalidFields);

        } else {
          const errMessage = err._message || err.message;
          console.error(`Error sending submission:`, errMessage);

          EventsFactory.submitFormError(formId, err);
          presenter.onFormError(errMessage);
        }

        throw err;
      });
  }

}

module.exports = FormInteractor;
