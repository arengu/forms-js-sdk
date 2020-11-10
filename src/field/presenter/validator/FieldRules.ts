import isNil from 'lodash/isNil';

import { IFieldValidationResult, IFieldValidationFunction } from './FieldValidator';
import {
  IFieldModel, ITextFieldModel, ITelFieldModel, INumberFieldModel,
  IChoiceFieldValue, IDropdownFieldValue, IStringFieldValue, IFieldValue, IPasswordFieldModel,
} from '../../model/FieldModel';
import { FieldError } from '../../../error/InvalidFields';
import { FieldErrorCode } from '../../../error/ErrorCodes';

const VALID: IFieldValidationResult = { valid: true };

function alwaysValid(): IFieldValidationResult {
  return VALID;
}

type IMultipleFieldValue = IChoiceFieldValue | IDropdownFieldValue;

export const FieldRules = {
  require(fieldM: IFieldModel): IFieldValidationFunction<IFieldValue> {
    if (fieldM.required !== true) {
      return alwaysValid;
    }

    return function requireValue(value: IFieldValue): IFieldValidationResult {
      if (isNil(value)) {
        return {
          valid: false,
          error: FieldError.create(
            fieldM.id,
            FieldErrorCode.REQUIRED_PROPERTY,
            'This field is required',
          ),
        };
      }

      return VALID;
    }
  },

  minLength(fieldM: ITextFieldModel | ITelFieldModel | IPasswordFieldModel): IFieldValidationFunction<IStringFieldValue> {
    const { minLength } = fieldM.config;

    if (isNil(minLength)) {
      return alwaysValid;
    }

    const fieldId = fieldM.id;

    return function checkMinLength(value: IStringFieldValue): IFieldValidationResult {
      if (isNil(value) || value.length >= minLength) {
        return VALID;
      }

      return {
        valid: false,
        error: FieldError.create(
          fieldId,
          FieldErrorCode.TOO_SHORT_STRING,
          `This field must be at least ${minLength} character(s)`,
          { minLength },
        ),
      };
    }
  },

  maxLength(fieldM: ITextFieldModel | ITelFieldModel | IPasswordFieldModel): IFieldValidationFunction<IStringFieldValue> {
    const { maxLength } = fieldM.config;

    if (isNil(maxLength)) {
      return alwaysValid;
    }

    const fieldId = fieldM.id;

    return function checkMaxLength(value: IStringFieldValue): IFieldValidationResult {
      if (isNil(value) || value.length <= maxLength) {
        return VALID;
      }

      return {
        valid: false,
        error: FieldError.create(
          fieldId,
          FieldErrorCode.TOO_LONG_STRING,
          `This field must be less or equal to ${maxLength} character(s)`,
          { maxLength },
        ),
      };
    }
  },

  minValue(fieldM: INumberFieldModel): IFieldValidationFunction<IStringFieldValue> {
    const { minValue } = fieldM.config;

    if (isNil(minValue)) {
      return alwaysValid;
    }

    const fieldId = fieldM.id;

    return function checkMinValue(strValue: IStringFieldValue): IFieldValidationResult {
      if (isNil(strValue)) {
        return VALID;
      }

      const numValue = +strValue;

      if (numValue >= minValue) {
        return VALID;
      }

      return {
        valid: false,
        error: FieldError.create(
          fieldId,
          FieldErrorCode.TOO_SMALL_NUMBER,
          `This number must be greater than or equal to ${minValue}`,
          { minValue },
        ),
      };
    };
  },

  maxValue(fieldM: INumberFieldModel): IFieldValidationFunction<IStringFieldValue> {
    const { maxValue } = fieldM.config;

    if (isNil(maxValue)) {
      return alwaysValid;
    }

    const fieldId = fieldM.id;

    return function checkMaxValue(strValue: IStringFieldValue): IFieldValidationResult {
      if (isNil(strValue)) {
        return VALID;
      }

      const numValue = +strValue;

      if (numValue <= maxValue) {
        return VALID;
      }

      return {
        valid: false,
        error: FieldError.create(
          fieldId,
          FieldErrorCode.TOO_BIG_NUMBER,
          `This number must be less than or equal to ${maxValue}`,
          { maxValue },
        ),
      };
    };
  },

  multiple(fieldM: IFieldModel): IFieldValidationFunction<IMultipleFieldValue> {
    const { id: fieldId, required } = fieldM;

    if (required !== true) {
      return alwaysValid;
    }

    return function checkValue(value: IMultipleFieldValue): IFieldValidationResult {
      if (isNil(value)) {
        return {
          valid: false,
          error: FieldError.create(
            fieldId,
            FieldErrorCode.NO_OPTION_CHOSEN,
            'You have to select an option',
          ),
        };
      }

      if (value.length === 0) {
        return {
          valid: false,
          error: FieldError.create(
            fieldId,
            FieldErrorCode.ZERO_OPTIONS_CHOSEN,
            'You have to select at least one option',
          ),
        };
      }

      return VALID;
    };
  },
};
