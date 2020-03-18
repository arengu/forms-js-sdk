import { IURLFieldModel } from '../../model/FieldModel';
import { InputConfigurator, InputCreator } from './InputHelper';
import { StringInputView, IStringInputView } from './StringInputView';

export const URLInputType = 'url';

export const URLInputRenderer = {
  renderInput(fieldM: IURLFieldModel): HTMLInputElement {
    const elem = InputCreator.input(fieldM, URLInputType);

    InputConfigurator.placeholder(elem, fieldM);
    InputConfigurator.defaultValue(elem, fieldM);

    return elem;
  },
};

export type IURLInputView = IStringInputView;

export class URLInputView extends StringInputView implements IURLInputView {
  public static create(fieldM: IURLFieldModel): IURLInputView {
    const inputE = URLInputRenderer.renderInput(fieldM);
    return new URLInputView(inputE);
  }
}
