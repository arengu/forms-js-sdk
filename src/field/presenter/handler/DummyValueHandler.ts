import { IFieldModel, IFieldValue } from '../../model/FieldModel';
import { IInputView, IInputValue } from '../../view/InputView';
import { IValueHandler } from './ValueHandler';

export type IConvertibleValue = IInputValue & IFieldValue;

export class DummyValueHandler<VA extends IConvertibleValue>
  implements IValueHandler<IFieldModel, IInputView<VA>, VA> {
  public async getValue( // eslint-disable-line class-methods-use-this
    inputV: IInputView<VA>,
  ): Promise<VA> {
    return inputV.getValue();
  }

  public static create<VA extends IConvertibleValue>():
    IValueHandler<IFieldModel, IInputView<VA>, VA> {
    return new this();
  }
}
