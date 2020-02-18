import { IFieldModel, IFieldValue } from '../../model/FieldModel';
import { IInputView } from '../../view/InputView';

export interface IValueHandler<FM extends IFieldModel,
  IV extends IInputView, FVA extends IFieldValue> {
  getValue(inputV: IV, fieldM: FM): FVA | Promise<FVA>;
  setValue(inputV: IV, value: FVA, fieldM: FM): void;
}
