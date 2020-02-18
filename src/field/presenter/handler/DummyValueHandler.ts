import { IFieldModel, IFieldValue } from '../../model/FieldModel';
import { IInputView } from '../../view/InputView';
import { IValueHandler } from './ValueHandler';

export interface IDummyInput<VAL> extends IInputView {
  getValue(): VAL;
}

export const DummyValueHandler = {
  create<FV extends IFieldValue>(): IValueHandler<IFieldModel, IDummyInput<FV>, FV> {
    return {
      getValue(inputV: IDummyInput<FV>): FV {
        return inputV.getValue();
      },

      setValue(inputV: IDummyInput<FV>, value: FV, fieldM: IFieldModel): void {
        console.warn(`Setting a value for ${fieldM.id} field is not supported`);
      }
    };
  },
};
