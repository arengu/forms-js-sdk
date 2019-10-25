import { IFieldValidationResult } from './FieldValidator';
import {
  ILegalFieldValue, ILegalFieldModel, IPaymentFieldValue,
  IPaymentFieldModel, INumberFieldValue, IFieldModel,
} from '../../model/FieldModel';
import { FieldError } from '../../../error/InvalidFields';
import { FieldErrorCode } from '../../../error/ErrorCodes';
import { IPaymentInputView } from '../../view/input/PaymentInputView';

const VALID: IFieldValidationResult = { valid: true };

export abstract class CustomValidations {
  public static async number(value: INumberFieldValue, fieldM: IFieldModel):
    Promise<IFieldValidationResult> {
    const { id: fieldId } = fieldM;

    if (value == undefined) { // eslint-disable-line eqeqeq
      return VALID;
    }

    const numValue = +value;

    if (Number.isNaN(numValue) === false) {
      return VALID;
    }

    return {
      valid: false,
      error: FieldError.create(
        fieldId,
        FieldErrorCode.NUMBER_EXPECTED,
        'Please, enter a valid number.',
      ),
    };
  }

  public static async legal(value: ILegalFieldValue, fieldM: ILegalFieldModel):
    Promise<IFieldValidationResult> {
    const { id: fieldId, required } = fieldM;

    if (required === false || value === 'true') {
      return VALID;
    }

    return {
      valid: false,
      error: FieldError.create(
        fieldId,
        FieldErrorCode.ACCEPTANCE_REQUIRED,
        'Please, check this field if you want to proceed.',
      ),
    };
  }

  public static async payment(value: IPaymentFieldValue, fieldM: IPaymentFieldModel,
    inputV: IPaymentInputView): Promise<IFieldValidationResult> {
    if (inputV.isEmpty()) {
      if (!fieldM.required) {
        return VALID;
      }

      return {
        valid: false,
        error: FieldError.create(
          fieldM.id,
          FieldErrorCode.REQUIRED_PROPERTY,
          'This field is required',
        ),
      };
    }

    if (!inputV.isComplete()) {
      return {
        valid: false,
        error: FieldError.create(
          fieldM.id,
          FieldErrorCode.MISSING_CARD_INFO,
          'Some details are empty',
        ),
      };
    }

    if (!inputV.isValid()) {
      return {
        valid: false,
        error: FieldError.create(
          fieldM.id,
          FieldErrorCode.INVALID_CARD,
          'Some details are not valid',
        ),
      };
    }

    return VALID;
  }
}
