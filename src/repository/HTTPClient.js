const FormModel = require('../form/FormModel');

const Forbidden = require('../error/Forbidden');
const InternalError = require('../error/InternalError');
const NotFound = require('../error/NotFound');
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

const STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};

const CODE = {
  SERVER_ERROR: 'ERR_INTERNAL_ERROR',
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

      if (statusCode === STATUS.SERVER_ERROR) {
        throw InternalError.create('Error getting form');
      }

      throw SDKError.create('Unexpected response');

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

      if (statusCode === STATUS.OK) {
        return body;
      }

      if (statusCode === STATUS.BAD_REQUEST) {
        throw InvalidFields.fromResponse(body);
      }

      if (statusCode === STATUS.FORBIDDEN) {
        throw Forbidden.create(body.message);
      }

      if (statusCode === STATUS.SERVER_ERROR) {
        throw InternalError.create('Error creating submission');
      }

      throw SDKError.create('Unexpected response');

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

    const headers = {
      [HEADER.CONTENT_TYPE]: CONTENT_TYPE.JSON,
    };

    try {
      const res = await fetch(
        opUrl,
        {
          method: 'POST',
          headers: HTTPClient._buildHeaders(),
          body: JSON.stringify(data),
        }
      );

      const body = await res.json();
      const statusCode = res.status;

      if (statusCode === STATUS.OK) {
        return body;
      }

      if (body.code === CODE.SERVER_ERROR) {
        throw InternalError.create('Error validating information');
      }

      throw InvalidStep.create(body.message);

    } catch (err) {
      if (err instanceof SDKError) {
        throw err;
      } else {
        console.error('Error validating step', err);
        throw SDKError.create('Error validating step');
      }
    }
  }

};

module.exports = HTTPClient;
