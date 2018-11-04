const FormModel = require('../form/FormModel');

const InvalidFields = require('../error/InvalidFields');
const InvalidStep = require('../error/InvalidStep');
const SDKError = require('../error/SDKError');

const API_URL = WEBPACK_API_URL;

const HEADER = {
  CONTENT_TYPE: 'Content-Type',
  AUTHORIZATION: 'Authorization',
};

const CONTENT_TYPE = {
  JSON: 'application/json',
};

const AUTH_TYPE = {
  BEARER: 'Bearer',
};

const ERROR_CODE = {
  INVALID_FIELDS: 'ERR_INVALID_INPUT',
  INVALID_STEP: 'ERR_INVALID_STEP',
  SERVER_ERROR: 'ERR_SERVER_ERROR',
  NOT_FOUND: 'ERR_ENTITY_NOT_FOUND',
};

class HTTPClient {

  static _buildHeaders (signature) {
    const headers = {
      [HEADER.CONTENT_TYPE]: CONTENT_TYPE.JSON,
    };

    if (signature) {
      headers[HEADER.AUTHORIZATION] = `${AUTH_TYPE.BEARER} ${signature}`;
    }

    return headers;
  }

  static isSuccess (statusCode) {
    return statusCode && statusCode < 400;
  }

  static async getForm (formId) {
    const opUrl = `${API_URL}/forms/${formId}`;

    try {
      const res = await fetch(opUrl);

      const body = await res.json();
      const statusCode = res.status;

      if (HTTPClient.isSuccess(statusCode)) {
        return FormModel.create(body);
      }

      const errorCode = body.code;

      if (errorCode === ERROR_CODE.NOT_FOUND) {
        throw SDKError.create('Form not found');
      }

      console.error('Error retrieving form', body);
      throw SDKError.create('Error retrieving form');

    } catch (err) {
      if (err instanceof SDKError) {
        throw err;
      } else {
        console.error('Error retrieving form', err);
        throw SDKError.create('Error retrieving form');
      }
    }
  }

  static async createSubmission (formId, submission, signature) {
    const opUrl = `${API_URL}/forms/${formId}/submissions/`;

    try {
      const res = await fetch(
        opUrl,
        {
          method: 'POST',
          headers: HTTPClient._buildHeaders(signature),
          body: JSON.stringify(submission),
        }
      );

      const body = await res.json();
      const statusCode = res.status;

      if (HTTPClient.isSuccess(statusCode)) {
        return body;
      }

      const errorCode = body.code;

      if (errorCode === ERROR_CODE.INVALID_FIELDS) {
        throw InvalidFields.fromSchemaError(body);
      }

      if (errorCode === ERROR_CODE.INVALID_STEP) {
        throw InvalidStep.fromResponse(body);
      }

      console.error('Error creating submission', body);
      throw SDKError.create('Error creating submission');

    } catch (err) {
      if (err instanceof SDKError) {
        throw err;
      } else {
        console.error('Error creating submission', err);
        throw SDKError.create('Error creating submission');
      }
    }
  }

  static async validateStep (formId, stepId, data, signature) {
    const opUrl = `${API_URL}/forms/${formId}/validations/${stepId}`;

    try {
      const res = await fetch(
        opUrl,
        {
          method: 'POST',
          headers: HTTPClient._buildHeaders(signature),
          body: JSON.stringify(data),
        }
      );

      const body = await res.json();
      const statusCode = res.status;

      if (HTTPClient.isSuccess(statusCode)) {
        return body;
      }

      const errorCode = body.code;

      if (errorCode === ERROR_CODE.INVALID_FIELDS) {
        throw InvalidFields.fromSchemaError(body);
      }

      if (errorCode === ERROR_CODE.INVALID_STEP) {
        throw InvalidFields.fromResponse(body);
      }

      console.error('Error validating data', body);
      throw SDKError.create('Error validating data');

    } catch (err) {
      if (err instanceof SDKError) {
        throw err;
      } else {
        console.error('Error validating data', err);
        throw SDKError.create('Error validating data');
      }
    }
  }

};

module.exports = HTTPClient;
