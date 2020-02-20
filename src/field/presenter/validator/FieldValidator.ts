import { IFieldModel, IFieldValue } from '../../model/FieldModel';
import { IInputView } from '../../view/InputView';
import { FieldError } from '../../../error/InvalidFields';

export interface ISuccessfulFieldValidation {
  readonly valid: true;
}
export interface IFailedFieldValidation {
  readonly valid: false;
  readonly error: FieldError;
}

export type IFieldValidationResult = ISuccessfulFieldValidation | IFailedFieldValidation;

export interface IFieldValidationFunction<FM extends IFieldModel,
  IV extends IInputView, FVA extends IFieldValue> {
  (this: void, value: FVA, fieldM: FM, inputV: IV): IFieldValidationResult;
}

export interface IFieldValidator<FM extends IFieldModel,
  IV extends IInputView, FVA extends IFieldValue> {
  validate(value: FVA, fieldM: FM, inputV: IV): IFieldValidationResult;
}

export class FieldValidator<FM extends IFieldModel,
  IV extends IInputView, FVA extends IFieldValue>
  implements IFieldValidator<FM, IV, FVA> {
  protected readonly validations: IFieldValidationFunction<FM, IV, FVA>[];

  protected constructor(validations: IFieldValidationFunction<FM, IV, FVA>[]) {
    this.validations = validations;
  }

  public static create<FM extends IFieldModel, IV extends IInputView,
    FVA extends IFieldValue>(
      validations: IFieldValidationFunction<FM, IV, FVA>[],
  ): FieldValidator<FM, IV, FVA> {
    return new this(validations);
  }

  public validate(value: FVA, fieldM: FM, inputV: IV): IFieldValidationResult {
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
      const result = validation(value, fieldM, inputV);

      if (!result.valid) {
        return result;
      }
    }

    return { valid: true };
  }
}
