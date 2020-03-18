import { FieldError } from '../../../error/InvalidFields';

export interface ISuccessfulFieldValidation {
  readonly valid: true;
}
export interface IFailedFieldValidation {
  readonly valid: false;
  readonly error: FieldError;
}

export type IFieldValidationResult = ISuccessfulFieldValidation | IFailedFieldValidation;

export interface IFieldValidationFunction<FVA> {
  (this: void, value: FVA): IFieldValidationResult;
}

export interface IFieldValidator<FVA> {
  validate(value: FVA): IFieldValidationResult;
}

export class FieldValidator<FVA> implements IFieldValidator<FVA> {
  protected readonly validations: IFieldValidationFunction<FVA>[];

  protected constructor(validations: IFieldValidationFunction<FVA>[]) {
    this.validations = validations;
  }

  public static create<FVA>(validations: IFieldValidationFunction<FVA>[]): FieldValidator<FVA> {
    return new this(validations);
  }

  public validate(value: FVA): IFieldValidationResult {
    /*
     * Firefox <51 do NOT support declaring this variable as const into for...of statement
     * See https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/for...of
     */
    let validation;

    /*
     * Validations have to be executed sequentially because some of them depend on anothers
     * and we have to stop as soon as a rule is not satisfied.
     */
    for (validation of this.validations) {
      const result = validation(value);

      if (!result.valid) {
        return result;
      }
    }

    return { valid: true };
  }
}
