import isNil from 'lodash/isNil';

import { IFieldValidationResult } from './FieldValidator';
import {
  IFieldValue, IFieldModel, ITextFieldModel, ITelFieldModel, INumberFieldModel,
  IChoiceFieldValue, IDropdownFieldValue,
} from '../../model/FieldModel';
import { FieldError } from '../../../error/InvalidFields';
import { FieldErrorCode } from '../../../error/ErrorCodes';

const VALID: IFieldValidationResult = { valid: true };

export const FieldRules = {
  async require(value: IFieldValue, fieldM: IFieldModel):
    Promise<IFieldValidationResult> {
    if (fieldM.required !== true) {
      return VALID;
    }

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
  },

  async minLength(value: string | undefined, fieldM: ITextFieldModel | ITelFieldModel):
    Promise<IFieldValidationResult> {
    const { minLength } = fieldM.config;

    if (isNil(minLength) || isNil(value) || value.length >= minLength) {
      return VALID;
    }

    const fieldId = fieldM.id;

    return {
      valid: false,
      error: FieldError.create(
        fieldId,
        FieldErrorCode.TOO_SHORT_STRING,
        `This field must be at least ${minLength} character(s)`,
        { minLength },
      ),
    };
  },

  async maxLength(value: string | undefined, fieldM: ITextFieldModel | ITelFieldModel):
    Promise<IFieldValidationResult> {
    const { maxLength } = fieldM.config;

    if (isNil(maxLength) || isNil(value) || value.length <= maxLength) {
      return VALID;
    }

    const fieldId = fieldM.id;

    return {
      valid: false,
      error: FieldError.create(
        fieldId,
        FieldErrorCode.TOO_LONG_STRING,
        `This field must be less or equal to ${maxLength} character(s)`,
        { maxLength },
      ),
    };
  },

  async minValue(strValue: string | undefined, fieldM: INumberFieldModel):
    Promise<IFieldValidationResult> {
    const { minValue } = fieldM.config;

    if (isNil(minValue) || isNil(strValue)) {
      return VALID;
    }

    const numValue = +strValue;

    if (numValue >= minValue) {
      return VALID;
    }

    const fieldId = fieldM.id;

    return {
      valid: false,
      error: FieldError.create(
        fieldId,
        FieldErrorCode.TOO_SMALL_NUMBER,
        `This number must be greater than or equal to ${minValue}`,
        { minValue },
      ),
    };
  },

  async maxValue(strValue: string | undefined, fieldM: INumberFieldModel):
    Promise<IFieldValidationResult> {
    const { maxValue } = fieldM.config;

    if (isNil(maxValue) || isNil(strValue)) {
      return VALID;
    }

    const numValue = +strValue;

    if (numValue <= maxValue) {
      return VALID;
    }

    const fieldId = fieldM.id;

    return {
      valid: false,
      error: FieldError.create(
        fieldId,
        FieldErrorCode.TOO_BIG_NUMBER,
        `This number must be less than or equal to ${maxValue}`,
        { maxValue },
      ),
    };
  },

  async multiple(value: IChoiceFieldValue | IDropdownFieldValue, fieldM: IFieldModel):
    Promise<IFieldValidationResult> {
    const { id: fieldId, required } = fieldM;

    if (required !== true) {
      return VALID;
    }

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
  },
};
