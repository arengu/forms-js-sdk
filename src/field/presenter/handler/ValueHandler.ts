import { IFieldModel, IFieldValue } from '../../model/FieldModel';
import { IInputView, IInputValue } from '../../view/InputView';

export interface IValueHandler<FM extends IFieldModel,
  IV extends IInputView<IInputValue>, FVA extends IFieldValue> {
  getValue(inputV: IV, fieldM: FM): Promise<FVA>;
}
