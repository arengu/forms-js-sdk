import { IInputViewListener, IInputView } from '../InputView';
import { StringInputView } from './StringInputView';
import { InputCreator, InputConfigurator } from './InputHelper';
import { INumberFieldModel } from '../../model/FieldModel';

export const NumberInputType = 'number';

export abstract class NumberInputRenderer {
  public static renderInput(fieldM: INumberFieldModel, uid: string,
    inputL: IInputViewListener): HTMLInputElement {
    const elem = InputCreator.input(fieldM, uid, NumberInputType);

    InputConfigurator.placeholder(elem, fieldM);
    InputConfigurator.defaultValue(elem, fieldM);
    InputConfigurator.rangeRules(elem, fieldM);
    InputConfigurator.addListeners(elem, inputL);

    return elem;
  }
}

export type INumberInputValue = string;

export type INumberInputView = IInputView;

export class NumberInputView extends StringInputView implements INumberInputView {
  public static create(fieldM: INumberFieldModel, uid: string,
    inputL: IInputViewListener): NumberInputView {
    const inputE = NumberInputRenderer.renderInput(fieldM, uid, inputL);
    return new this(inputE);
  }
}
