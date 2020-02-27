import { UID } from '../../../lib/UID';
import { ITelFieldModel } from '../../model/FieldModel';
import { InputConfigurator, InputCreator } from './InputHelper';
import { StringInputView, IStringInputView } from './StringInputView';

export const TelInputType = 'tel';

export abstract class TelInputRenderer {
  public static renderInput(fieldM: ITelFieldModel, uid: string): HTMLInputElement {
    const elem = InputCreator.input(fieldM, uid, TelInputType);

    InputConfigurator.placeholder(elem, fieldM);
    InputConfigurator.defaultValue(elem, fieldM);
    InputConfigurator.lengthRules(elem, fieldM);
    elem.autocomplete = 'tel-national';

    return elem;
  }
}

export type ITelInputValue = string;

export type ITelInputView = IStringInputView;

export class TelInputView extends StringInputView implements ITelInputView {
  public static create(fieldM: ITelFieldModel): ITelInputView {
    const uid = UID.create();
    const inputE = TelInputRenderer.renderInput(fieldM, uid);
    return new TelInputView(uid, inputE);
  }
}
