import { IFieldModel } from '../../model/FieldModel';
import { IInputView } from '../../view/InputView';
import { IValueHandler } from './ValueHandler';

export interface IDummyInput<VAL> extends IInputView {
  getValue(): VAL;
}

export const DummyValueHandler = {
  create<FV>(inputV: IDummyInput<FV>, fieldM: IFieldModel): IValueHandler<FV> {
    return {
      getValue(): FV {
        return inputV.getValue();
      },

      setValue(): void {
        console.warn(`Setting a value for ${fieldM.id} field is not supported`);
      }
    };
  },
};
