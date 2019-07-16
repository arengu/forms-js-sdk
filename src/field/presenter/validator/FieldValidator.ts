import { IFieldModel, IFieldValue } from '../../model/FieldModel';
import { IInputView, IInputValue } from '../../view/InputView';
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
  IV extends IInputView<IInputValue>, FVA extends IFieldValue> {
  (this: void, value: FVA, fieldM: FM, inputV: IV): Promise<IFieldValidationResult>;
}

export interface IFieldValidator<FM extends IFieldModel,
  IV extends IInputView<IInputValue>, FVA extends IFieldValue> {
  validate(value: FVA, fieldM: FM, inputV: IV): Promise<IFieldValidationResult>;
}

export class FieldValidator<FM extends IFieldModel,
  IV extends IInputView<IInputValue>, FVA extends IFieldValue>
  implements IFieldValidator<FM, IV, FVA> {
  protected readonly validations: IFieldValidationFunction<FM, IV, FVA>[];

  protected constructor(validations: IFieldValidationFunction<FM, IV, FVA>[]) {
    this.validations = validations;
  }

  public static create<FM extends IFieldModel, IV extends IInputView<IInputValue>,
    FVA extends IFieldValue>(
      validations: IFieldValidationFunction<FM, IV, FVA>[],
  ): FieldValidator<FM, IV, FVA> {
    return new this(validations);
  }

  public async validate(value: FVA, fieldM: FM, inputV: IV): Promise<IFieldValidationResult> {
    /*
     * Firefox <51 do NOT support declaring this variable as const into for...of statement
     * See https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/for...of
     */
    let validation;

    /*
     * Validations have to be executed sequentially because some of them depend on anothers
     * and we have to stop as soon as a rule is not satisfied.
     */
    for (validation of this.validations) { // eslint-disable-line no-restricted-syntax
      const result = await validation( // eslint-disable-line no-await-in-loop
        value, fieldM, inputV,
      );

      if (!result.valid) {
        return result;
      }
    }

    return { valid: true };
  }
}
