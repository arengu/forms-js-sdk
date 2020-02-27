import { UID } from '../../../lib/UID';
import { IURLFieldModel } from '../../model/FieldModel';
import { InputConfigurator, InputCreator } from './InputHelper';
import { StringInputView, IStringInputView } from './StringInputView';

export const URLInputType = 'url';

export abstract class URLInputRenderer {
  public static renderInput(fieldM: IURLFieldModel, uid: string): HTMLInputElement {
    const elem = InputCreator.input(fieldM, uid, URLInputType);

    InputConfigurator.placeholder(elem, fieldM);
    InputConfigurator.defaultValue(elem, fieldM);

    return elem;
  }
}

export type IURLInputView = IStringInputView;

export class URLInputView extends StringInputView implements IURLInputView {
  public static create(fieldM: IURLFieldModel): IURLInputView {
    const uid = UID.create();
    const inputE = URLInputRenderer.renderInput(fieldM, uid);
    return new URLInputView(uid, inputE);
  }
}
