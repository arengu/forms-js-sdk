import { IInputViewListener, IInputView } from '../InputView';
import { SimpleInputView } from './SimpleInputView';
import { InputCreator, InputConfigurator } from './InputHelper';
import { IEmailFieldModel } from '../../model/FieldModel';

export const EmailInputType = 'email';

export abstract class EmailInputRenderer {
  public static renderInput(fieldM: IEmailFieldModel, uid: string,
    inputL: IInputViewListener): HTMLInputElement {
    const elem = InputCreator.input(fieldM, uid, EmailInputType);

    InputConfigurator.placeholder(elem, fieldM);
    InputConfigurator.defaultValue(elem, fieldM);
    InputConfigurator.addListeners(elem, inputL);
    elem.autocomplete = 'email';

    return elem;
  }
}

export type IEmailInputValue = string;

export type IEmailInputView = IInputView<IEmailInputValue>;

export class EmailInputView extends SimpleInputView implements IEmailInputView {
  public static create(fieldM: IEmailFieldModel, uid: string,
    inputL: IInputViewListener): EmailInputView {
    const inputE = EmailInputRenderer.renderInput(fieldM, uid, inputL);
    return new this(inputE);
  }
}
