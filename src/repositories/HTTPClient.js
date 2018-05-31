const FormModel = require('../models/FormModel');
const SubmissionModel = require('../models/SubmissionModel');

const SchemaError = require('../models/SchemaError');
const SDKError = require('../models/SDKError');

class HTTPClient {

  constructor (sdk) {
    this.entrypoint = sdk.apiEntrypoint;
  }

  getForm (formId) {
    const opUrl = `${this.entrypoint}/public/forms/${formId}`;

    return fetch(opUrl)
      .then((data) => data.json())
      .catch((err) => {
        throw new SDKError(err.message || 'Internal error');
      })
      .then((body) => {
        if (FormModel.matches(body)) {
          return new FormModel(body);
        } else {
          console.error('Unexpected response', body);
          throw new SDKError('Unexpected model');
        }
      });
  }

  createSubmission (submission) {
    const opUrl = `${this.entrypoint}/public/submissions/`;

    return fetch(
      opUrl,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submission),
      }
    )
      .then((data) => data.json())
      .catch((err) => {
        throw new SDKError(err.message || 'Internal error');
      })
      .then((body) => {
        if (SubmissionModel.matches(body)) {
          return new SubmissionModel(body);
        } else if (SchemaError.matches(body)) {
          throw new SchemaError(body);
        } else {
          console.error('Unexpected response', body);
          throw new SDKError('Unexpected model');
        }
      });
  }

  static create () {
    return new HTTPClient(...arguments);
  }

};

module.exports = HTTPClient;
