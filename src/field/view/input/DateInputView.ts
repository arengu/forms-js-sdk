import { IInputViewListener, IInputView } from '../InputView';
import { SimpleInputView } from './SimpleInputView';
import { InputCreator, InputConfigurator } from './InputHelper';
import { IDateFieldModel, DateFormat } from '../../model/FieldModel';

export enum DateInputType {
  DATE = 'date',
  TIME = 'time',
}

export abstract class DateInputCreator {
  public static fromFormat(fieldM: IDateFieldModel, uid: string): HTMLInputElement {
    const { format } = fieldM.config;

    switch (format) {
      case DateFormat.DATE:
        return InputCreator.input(fieldM, uid, DateInputType.DATE);
      case DateFormat.TIME:
        return InputCreator.input(fieldM, uid, DateInputType.TIME);
      default:
        throw new Error('Unknown format');
    }
  }
}

export abstract class DateInputRenderer {
  public static renderInput(fieldM: IDateFieldModel, uid: string,
    inputL: IInputViewListener): HTMLInputElement {
    const inputE = DateInputCreator.fromFormat(fieldM, uid);

    InputConfigurator.placeholder(inputE, fieldM);
    InputConfigurator.defaultValue(inputE, fieldM);
    InputConfigurator.addListeners(inputE, inputL);

    return inputE;
  }
}

export type IDateInputValue = string;

export type IDateInputView = IInputView<IDateInputValue>;

export class DateInputView extends SimpleInputView implements IDateInputView {
  public static create(fieldM: IDateFieldModel, uid: string,
    inputL: IInputViewListener): DateInputView {
    const inputE = DateInputRenderer.renderInput(fieldM, uid, inputL);
    return new this(inputE);
  }
}
