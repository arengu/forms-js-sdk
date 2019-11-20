import { IInputViewListener, IInputView } from '../InputView';
import { StringInputView } from './StringInputView';
import { InputConfigurator, InputCreator } from './InputHelper';
import { ITelFieldModel } from '../../model/FieldModel';

export const TelInputType = 'tel';

export abstract class TelInputRenderer {
  public static renderInput(fieldM: ITelFieldModel, uid: string,
    inputL: IInputViewListener): HTMLInputElement {
    const elem = InputCreator.input(fieldM, uid, TelInputType);

    InputConfigurator.placeholder(elem, fieldM);
    InputConfigurator.defaultValue(elem, fieldM);
    InputConfigurator.lengthRules(elem, fieldM);
    InputConfigurator.addListeners(elem, inputL);
    elem.autocomplete = 'tel-national';

    return elem;
  }
}

export type ITelInputValue = string;

export type ITelInputView = IInputView<ITelInputValue>;

export class TelInputView extends StringInputView implements ITelInputView {
  public static create(fieldM: ITelFieldModel, uid: string,
    inputL: IInputViewListener): TelInputView {
    const inputE = TelInputRenderer.renderInput(fieldM, uid, inputL);
    return new this(inputE);
  }
}
