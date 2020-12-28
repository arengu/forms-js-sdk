import isNil from 'lodash/isNil';

import { IFieldValidationResult, IFieldValidationFunction } from './FieldValidator';
import {
  ILegalFieldValue, ILegalFieldModel, IPaymentFieldValue,
  IPaymentFieldModel, INumberFieldValue, INumberFieldModel, IPasswordFieldModel, IPasswordFieldValue,
} from '../../model/FieldModel';
import { FieldError } from '../../../error/InvalidFields';
import { FieldErrorCode } from '../../../error/ErrorCodes';
import { IPasswordInputView } from '../../view/input/PasswordInputView';
import { FieldRules } from './FieldRules';
import { StringValueHandler } from '../handler/StringValueHandler';
import { PaymentDetailsState, IPaymentProvider } from '../../view/input/payment/PaymentProvider';

const VALID: IFieldValidationResult = { valid: true };

function alwaysValid(): IFieldValidationResult {
  return VALID;
}

export const CustomValidations = {
  number(fieldM: INumberFieldModel): IFieldValidationFunction<INumberFieldValue> {
    const { id: fieldId } = fieldM;

    return function parseNumber(value: INumberFieldValue): IFieldValidationResult {
      if (isNil(value)) {
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
    };
  },

  legal(fieldM: ILegalFieldModel): IFieldValidationFunction<ILegalFieldValue> {
    const { id: fieldId, required } = fieldM;

    if (required === false) {
      return alwaysValid;
    }

    return function checkLegal(value: ILegalFieldValue): IFieldValidationResult {
      if (value === 'true') {
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
  },

  payment(fieldM: IPaymentFieldModel, paymentP: IPaymentProvider): IFieldValidationFunction<IPaymentFieldValue> {
    return function checkPayment(): IFieldValidationResult {
      const state = paymentP.getState();

      if (state === PaymentDetailsState.EMPTY) {
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

      if (state === PaymentDetailsState.INCOMPLETE) {
        return {
          valid: false,
          error: FieldError.create(
            fieldM.id,
            FieldErrorCode.MISSING_CARD_INFO,
            'Some details are empty',
          ),
        };
      }

      if (state === PaymentDetailsState.INVALID) {
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
    };
  },

  passwordMinLength(fieldM: IPasswordFieldModel, inputV: IPasswordInputView): IFieldValidationFunction<IPasswordFieldValue> {
    const validator = FieldRules.minLength(fieldM);
    const handler = StringValueHandler.create(inputV);

    return function checkMinLength(): IFieldValidationResult {
      return validator(handler.getValue());
    }
  },

  passwordMaxLength(fieldM: IPasswordFieldModel, inputV: IPasswordInputView): IFieldValidationFunction<IPasswordFieldValue> {
    const validator = FieldRules.maxLength(fieldM);

    return function checkMaxLength(): IFieldValidationResult {
      return validator(inputV.getValue());
    }
  },
};
