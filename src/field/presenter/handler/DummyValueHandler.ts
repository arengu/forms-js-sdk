import { IFieldModel } from '../../model/FieldModel';
import { IInputView } from '../../view/InputView';
import { ISyncValueHandler } from './ValueHandler';

export interface IDummyInput<VAL> extends IInputView {
  getValue(): VAL;
}

export const DummyValueHandler = {
  create<FV>(inputV: IDummyInput<FV>, fieldM: IFieldModel): ISyncValueHandler<FV> {
    return {
      getValue(): FV {
        return inputV.getValue();
      },

      setDefaultValue(): void {
        // nothing to do
      },

      setValue(): FV {
        throw new Error(`Setting a value for ${fieldM.id} field is not supported`);
      }
    };
  },
};
