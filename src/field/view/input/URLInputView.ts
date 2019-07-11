import { IInputViewListener, IInputView } from '../InputView';
import { SimpleInputView } from './SimpleInputView';
import { InputConfigurator, InputCreator } from './InputHelper';
import { IURLFieldModel } from '../../model/FieldModel';

export const URLInputType = 'url';

export abstract class URLInputRenderer {
  public static renderInput(fieldM: IURLFieldModel, uid: string,
    inputL: IInputViewListener): HTMLInputElement {
    const elem = InputCreator.input(fieldM, uid, URLInputType);

    InputConfigurator.placeholder(elem, fieldM);
    InputConfigurator.defaultValue(elem, fieldM);
    InputConfigurator.addListeners(elem, inputL);

    return elem;
  }
}

export type IURLInputValue = string;

export type IURLInputView = IInputView<IURLInputValue>;

export class URLInputView extends SimpleInputView implements IURLInputView {
  public static create(fieldM: IURLFieldModel, uid: string,
    inputL: IInputViewListener): URLInputView {
    const inputE = URLInputRenderer.renderInput(fieldM, uid, inputL);
    return new this(inputE);
  }
}
