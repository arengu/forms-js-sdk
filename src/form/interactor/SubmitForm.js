const InvalidFields = require('../../error/InvalidFields');

const Repository = require('../../repository/HTTPClient');
const EventsFactory = require('../../lib/EventsFactory');

class SubmitForm {

  static async execute (formId, submission, signature) {
    try {
      EventsFactory.submitForm(formId, submission);
      const res = await Repository.createSubmission(formId, submission, signature);

      EventsFactory.submitFormSuccess(formId, res);
      return res;
    } catch (err) {
      if (err instanceof InvalidFields) {
        console.error(`Some values are not valid:`, err.fields);
        EventsFactory.invalidFieldsError(formId, err);
      } else {
        console.error(`Error sending submission:`, err);
        EventsFactory.submitFormError(formId, err);
      }
      throw err;
    }
  }

}

module.exports = SubmitForm;
