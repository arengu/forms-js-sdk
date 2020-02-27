import { UID } from '../../../lib/UID';
import { DateFormat, IDateFieldModel } from '../../model/FieldModel';
import { InputConfigurator, InputCreator } from './InputHelper';
import { StringInputView, IStringInputView } from './StringInputView';

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
        throw new Error(`Unknown format ${format}`);
    }
  }
}

export abstract class DateInputRenderer {
  public static renderInput(fieldM: IDateFieldModel, uid: string): HTMLInputElement {
    const inputE = DateInputCreator.fromFormat(fieldM, uid);

    InputConfigurator.defaultValue(inputE, fieldM);

    return inputE;
  }
}

export type IDateInputView = IStringInputView;

export class DateInputView extends StringInputView implements IDateInputView {
  public static create(fieldM: IDateFieldModel): IDateInputView {
    const uid = UID.create();
    const inputE = DateInputRenderer.renderInput(fieldM, uid);
    return new DateInputView(uid, inputE);
  }
}
