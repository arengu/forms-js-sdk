const FormModel = require('../form/FormModel');
const SubmissionModel = require('../form/SubmissionModel');

const SchemaError = require('../error/SchemaError');
const SDKError = require('../error/SDKError');

const API_URL = WEBPACK_API_URL;

const STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
};

class HTTPClient {

  getForm (formId) {
    const opUrl = `${API_URL}/forms/${formId}`;

    return fetch(opUrl)
      .catch((err) => {
        throw SDKError.create(err.message || 'Internal error');
      })
      .then((res) => {
        switch (res.status) {
          case STATUS.OK:
            return res.json().then(FormModel.create);
          case STATUS.NOT_FOUND:
            throw new SDKError('Form not found');
          default:
            throw SDKError.create('Unexpected response');
        }
      });
  }

  createSubmission (formId, submission) {
    const opUrl = `${API_URL}/forms/${formId}/submissions/`;

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
      .catch((err) => {
        throw SDKError.create(err.message || 'Internal error');
      })
      .then((res) => {
        switch (res.status) {
          case STATUS.OK:
            return res.json().then(SubmissionModel.create);
          case STATUS.BAD_REQUEST:
            return res.json().then((body) => { throw SchemaError.create(body) });
          default:
            throw SDKError.create('Unexpected response');
        }
      });
  }

  static create () {
    return new HTTPClient(...arguments);
  }

};

module.exports = HTTPClient;
