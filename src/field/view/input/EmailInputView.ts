import { IEmailFieldModel } from '../../model/FieldModel';
import { InputConfigurator, InputCreator } from './InputHelper';
import { StringInputView, IStringInputView } from './StringInputView';

export const EmailInputType = 'email';

export abstract class EmailInputRenderer {
  public static renderInput(fieldM: IEmailFieldModel): HTMLInputElement {
    const elem = InputCreator.input(fieldM, EmailInputType);

    InputConfigurator.placeholder(elem, fieldM);
    InputConfigurator.defaultValue(elem, fieldM);
    elem.autocomplete = 'email';

    return elem;
  }
}

export type IEmailInputView = IStringInputView;

export class EmailInputView extends StringInputView implements IEmailInputView {
  public static create(fieldM: IEmailFieldModel): IEmailInputView {
    const inputE = EmailInputRenderer.renderInput(fieldM);
    return new EmailInputView(inputE);
  }
}
