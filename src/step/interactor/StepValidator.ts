import { IFieldPresenter } from '../../field/presenter/FieldPresenter';

import { FieldError } from '../../error/InvalidFields';
import { IFailedFieldValidation, IFieldValidationResult } from '../../field/presenter/validator/FieldValidator';

export interface ISuccessfulStepValidation {
  readonly valid: true;
}
export interface IFailedStepValidation {
  readonly valid: false;
  readonly errors: FieldError[];
}

export type IStepValidationResult = ISuccessfulStepValidation | IFailedStepValidation;

export const ValidatorHelper = {
  isError(result: IFieldValidationResult): result is IFailedFieldValidation {
    return result.valid === false;
  },

  getError(result: IFailedFieldValidation): FieldError {
    return result.error;
  },
}

export const ValidateFields = {
  async execute(fieldsP: IFieldPresenter[]): Promise<IStepValidationResult> {
    const proms = fieldsP.map((fP) => fP.validate());
    const results = await Promise.all(proms);

    const invalids = results.filter(ValidatorHelper.isError);

    const errors = invalids.map(ValidatorHelper.getError);

    if (errors.length === 0) {
      return {
        valid: true,
      };
    }

    console.error('Some values are not valid', errors);

    return {
      valid: false,
      errors,
    };
  },
};
