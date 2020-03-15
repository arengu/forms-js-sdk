import { DateFormat, IDateFieldModel } from '../../model/FieldModel';
import { InputConfigurator, InputCreator } from './InputHelper';
import { StringInputView, IStringInputView } from './StringInputView';

export enum DateInputType {
  DATE = 'date',
  TIME = 'time',
}

export const DateInputCreator = {
  fromFormat(fieldM: IDateFieldModel): HTMLInputElement {
    const { format } = fieldM.config;

    switch (format) {
      case DateFormat.DATE:
        return InputCreator.input(fieldM, DateInputType.DATE);
      case DateFormat.TIME:
        return InputCreator.input(fieldM, DateInputType.TIME);
      default:
        throw new Error(`Unknown format ${format}`);
    }
  },
};

export const DateInputRenderer = {
  renderInput(fieldM: IDateFieldModel): HTMLInputElement {
    const inputE = DateInputCreator.fromFormat(fieldM);

    InputConfigurator.defaultValue(inputE, fieldM);

    return inputE;
  },
};

export type IDateInputView = IStringInputView;

export class DateInputView extends StringInputView implements IDateInputView {
  public static create(fieldM: IDateFieldModel): IDateInputView {
    const inputE = DateInputRenderer.renderInput(fieldM);
    return new DateInputView(inputE);
  }
}
