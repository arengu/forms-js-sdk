import { UID } from '../../../lib/UID';
import { INumberFieldModel } from '../../model/FieldModel';
import { InputConfigurator, InputCreator } from './InputHelper';
import { StringInputView, IStringInputView } from './StringInputView';

export const NumberInputType = 'number';

export abstract class NumberInputRenderer {
  public static renderInput(fieldM: INumberFieldModel, uid: string): HTMLInputElement {
    const elem = InputCreator.input(fieldM, uid, NumberInputType);

    InputConfigurator.placeholder(elem, fieldM);
    InputConfigurator.defaultValue(elem, fieldM);
    InputConfigurator.rangeRules(elem, fieldM);

    return elem;
  }
}

export type INumberInputView = IStringInputView;

export class NumberInputView extends StringInputView implements INumberInputView {
  public static create(fieldM: INumberFieldModel): INumberInputView {
    const uid = UID.create();
    const inputE = NumberInputRenderer.renderInput(fieldM, uid);
    return new NumberInputView(uid, inputE);
  }
}
