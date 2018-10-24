const FormModel = require('../form/FormModel');

const NotFound = require('../error/NotFound');
const InvalidFields = require('../error/InvalidFields');
const SDKError = require('../error/SDKError');

const API_URL = WEBPACK_API_URL;

const STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
};

class HTTPClient {

  static async getForm (formId) {
    const opUrl = `${API_URL}/forms/${formId}`;

    try {
      const res = await fetch(opUrl);

      const body = await res.json();
      const statusCode = res.status;

      if (statusCode === STATUS.OK) {
        return FormModel.create(body);
      }

      if (statusCode === STATUS.NOT_FOUND) {
        throw NotFound.create(body.message);
      }

      throw SDKError('Unexpected response');

    } catch (err) {
      if (err instanceof SDKError) {
        throw err;
      } else {
        console.error('Error retrieving form', err);
        throw SDKError.create('Error retrieving form');
      }
    }
  }

  static async createSubmission (formId, submission) {
    const opUrl = `${API_URL}/forms/${formId}/submissions/`;

    try {
      const res = await fetch(
        opUrl,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(submission),
        }
      );

      const body = await res.json();
      const statusCode = res.status;

      if (statusCode === STATUS.OK) {
        return body;
      }

      if (statusCode === STATUS.BAD_REQUEST) {
        throw InvalidFields.fromResponse(body);
      }

      throw SDKError('Unexpected response');

    } catch (err) {
      if (err instanceof SDKError) {
        throw err;
      } else {
        console.error('Error creating submission', err);
        throw SDKError.create('Error creating submission');
      }
    }
  }

};

module.exports = HTTPClient;
