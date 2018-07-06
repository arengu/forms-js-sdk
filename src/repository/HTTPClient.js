const FormModel = require('../form/FormModel');
const SubmissionModel = require('../form/SubmissionModel');

const SchemaError = require('../error/SchemaError');
const SDKError = require('../error/SDKError');

const API_URL = WEBPACK_API_URL;

const NOT_FOUND_CODE = 404;

class HTTPClient {

  getForm (formId) {
    const opUrl = `${API_URL}/public/forms/${formId}`;

    return fetch(opUrl)
      .catch((err) => {
        throw SDKError.create(err.message || 'Internal error');
      })
      .then((res) => {
        if (res.status === NOT_FOUND_CODE) {
          throw new SDKError('Form not found');
        }
        return res.json()
      })
      .then((body) => {
        if (FormModel.matches(body)) {
          return FormModel.create(body);
        } else {
          console.error('Unexpected response', body);
          throw SDKError.create('Unexpected response');
        }
      });
  }

  createSubmission (submission) {
    const opUrl = `${API_URL}/public/submissions/`;

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
        throw SDKError.create(err.message || 'Internal error');
      })
      .then((body) => {
        if (SubmissionModel.matches(body)) {
          return SubmissionModel.create(body);
        } else if (SchemaError.matches(body)) {
          throw SchemaError.create(body);
        } else {
          console.error('Unexpected response', body);
          throw SDKError.create('Unexpected model');
        }
      });
  }

  static create () {
    return new HTTPClient(...arguments);
  }

};

module.exports = HTTPClient;
