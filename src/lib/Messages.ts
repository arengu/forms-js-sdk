import toString from 'lodash/toString';
import { ArenguError, IErrorDetails } from '../error/ArenguError';
import { FieldErrorCode, AppErrorCode } from '../error/ErrorCodes';

export interface IMessages {
  readonly [key: string]: string;
}

export const DEFAULT_MESSAGES: IMessages = {
  [AppErrorCode.FORM_NOT_FOUND]: 'The requested form was not found.',

  /*
   * These errors only happen when the form owner modifies the validation flows
   * while someone is filling the form.
   */
  [AppErrorCode.VALIDATION_REQUIRED]: 'You have at least one pending validation.',
  [AppErrorCode.MISSING_VALIDATION]: 'There is at least one pending validation.',
  [AppErrorCode.NO_VALIDATION_REQUIRED]: 'The specified step does not have any validation associated.',
  [AppErrorCode.SIGNATURE_REQUIRED]: 'The form requires at least one validation and no signature was provided.',
  [AppErrorCode.FLOW_NOT_FOUND]: 'There was an internal error executing a flow that does not exist.',
  [AppErrorCode.STEP_NOT_FOUND]: 'The requested step was not found.',

  /*
   * These error messages cannot be reproduced unless you modify the requests
   */
  [AppErrorCode.SIGNATURE_MISMATCH]: 'The provided signature has been altered since the last validation.',
  [AppErrorCode.WRONG_SIGNATURE]: 'The signature is valid but it is not for the specified form.',

  /*
    * Error message when someone spends too much time filling in the form.
    */
  [AppErrorCode.SIGNATURE_EXPIRED]: 'The provided signature has expired.',

  /*
    * Validation errors detected either frontend or backend.
    */
  [AppErrorCode.INVALID_INPUT]: 'One or more fields are not valid. Please, check errors and try again.',
  [FieldErrorCode.REQUIRED_PROPERTY]: 'This field is required.',
  [FieldErrorCode.TOO_SHORT_STRING]: 'This field must be at least {{minLength}} character(s).',
  [FieldErrorCode.TOO_LONG_STRING]: 'This field must be less or equal to {{maxLength}} character(s).',
  [FieldErrorCode.TOO_SMALL_NUMBER]: 'This number must be greater than or equal to {{minValue}}.',
  [FieldErrorCode.TOO_BIG_NUMBER]: 'This number must be less than or equal to {{maxValue}}.',
  [FieldErrorCode.NO_OPTION_CHOSEN]: 'You have to select an option.',
  [FieldErrorCode.ZERO_OPTIONS_CHOSEN]: 'You have to select at least one option.',
  [FieldErrorCode.ACCEPTANCE_REQUIRED]: 'Please, check this field if you want to proceed.',
  [FieldErrorCode.EMAIL_EXPECTED]: 'Please, enter a valid email address.',
  [FieldErrorCode.URL_EXPECTED]: 'Please, enter a valid URL.',
  [FieldErrorCode.DATE_EXPECTED]: 'Please, enter a valid date (eg. 2019-12-31).',
  [FieldErrorCode.TIME_EXPECTED]: 'Please, enter a valid time (eg. 23:59).',
  [FieldErrorCode.BOOLEAN_EXPECTED]: 'Please, enter a valid boolean.',
  [FieldErrorCode.NUMBER_EXPECTED]: 'Please, enter a valid number.',
  [FieldErrorCode.INTEGER_EXPECTED]: 'Please, enter a valid integer.',
  [FieldErrorCode.DECIMAL_EXPECTED]: 'Please, enter a valid decimal.',
  [FieldErrorCode.CURRENCY_EXPECTED]: 'Please, enter a valid amount.',
  [FieldErrorCode.MISSING_CARD_INFO]: 'Please, fill in all card information.',
  [FieldErrorCode.INVALID_CARD]: 'Please, check card information.',
  [FieldErrorCode.CHARGE_DECLINED]: 'Charge declined by card issuer.',
  [FieldErrorCode.EXPIRED_CARD]: 'The provided card is expired.',
  [FieldErrorCode.WRONG_SEC_CODE]: 'The provided security code is wrong.',
  [FieldErrorCode.WRONG_FORM_CONFIG]: 'Error processing payment.',
};

export class Messages {
  protected messages: IMessages;

  protected constructor(messages: IMessages) {
    this.messages = messages || {};
  }

  public static resolve(template: string, details: IErrorDetails): string {
    if (!details) {
      return template;
    }

    const vars = Object.keys(details);

    const message = vars.reduce((prev, key): string => prev.replace(`{{${key}}}`, toString(details[key])), template);

    return message;
  }

  public fromError(error: ArenguError): string {
    const { code, message, details } = error;

    const custMsg = this.messages[code];
    const defMsg = DEFAULT_MESSAGES[code];

    const template = custMsg || defMsg;

    return template ? Messages.resolve(template, details) : message;
  }

  public fromCode(code: string): string {
    const custMsg = this.messages[code];
    const defMsg = DEFAULT_MESSAGES[code];

    return custMsg || defMsg || code;
  }

  public static create(messages: IMessages): Messages {
    return new Messages(messages);
  }
}
