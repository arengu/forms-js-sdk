const defaultMessages = {
  ERR_FORM_NOT_FOUND: 'The requested form was not found.',
  ERR_FLOW_NOT_FOUND: 'The requested flow was not found.',
  ERR_STEP_NOT_FOUND: 'The requested step was not found.',

  // Multistep validations
  ERR_VALIDATION_REQUIRED: 'You have at least one pending validation.',
  ERR_MISSING_VALIDATION: ' There is at least one step that we did not validate.',
  ERR_NO_VALIDATION_REQUIRED: 'The specified step does not have any validation associated.',
  ERR_SIGNATURE_REQUIRED: ' The form requires at least one validation and no signature was provided.',
  ERR_SIGNATURE_EXPIRED: 'The provided signature has been expired.',
  ERR_SIGNATURE_MISMATCH: 'The provided signature has been altered since the last validation.',
  ERR_WRONG_SIGNATURE: 'The signature is valid but it is not for the specified form.',

  // Validation errors
  ERR_INVALID_INPUT: 'One or more fields are not valid. Please, check errors and try again.',
  ERR_REQUIRED_PROPERTY: 'This field is required.',
  ERR_TOO_SHORT_STRING: 'This field must be at least {{minLength}} character(s).',
  ERR_TOO_LONG_STRING: 'This field must be less or equal to {{maxLength}} character(s).',
  ERR_EMAIL_EXPECTED: 'Please, enter a valid email address.',
  ERR_URL_EXPECTED: 'Please, enter a valid URL.',
  ERR_BOOLEAN_EXPECTED: 'Please, enter a valid boolean.',
  ERR_INTEGER_EXPECTED: 'Please, enter a valid integer.',
  ERR_DECIMAL_EXPECTED: 'Please, enter a valid decimal.',
  ERR_CURRENCY_EXPECTED: 'Please, enter a valid amount.',
};

class Messages {

  constructor(messages) {
    this.messages = messages || {};
  }

  _resolve(message, details) {
    if (!details) {
      return message;
    }

    let msg = message;
    for (const key in details) {
      msg = msg.replace(`{{${key}}}`, details[key]);
    }

    return msg;
  }

  getErrorMessage(error) {
    const { code, message, details } = error;

    const template = this.messages[code] || defaultMessages[code];

    return template ? this._resolve(template, details) : message;
  }

  static get DEFAULT_MESSAGES () {
    return defaultMessages;
  }

  static create (messages) {
    return new Messages(messages);
  }

}

module.exports = Messages;
