import { INumberFieldModel } from '../../model/FieldModel';
import { InputConfigurator, InputCreator } from './InputHelper';
import { StringInputView, IStringInputView } from './StringInputView';

export const NumberInputType = 'number';

export const NumberInputRenderer = {
  renderInput(fieldM: INumberFieldModel): HTMLInputElement {
    const elem = InputCreator.input(fieldM, NumberInputType);

    InputConfigurator.placeholder(elem, fieldM);
    InputConfigurator.defaultValue(elem, fieldM);
    InputConfigurator.rangeRules(elem, fieldM);

    return elem;
  },
};

export type INumberInputView = IStringInputView;

export class NumberInputView extends StringInputView implements INumberInputView {
  public static create(fieldM: INumberFieldModel): INumberInputView {
    const inputE = NumberInputRenderer.renderInput(fieldM);
    return new NumberInputView(inputE);
  }
}
