import { UID } from '../../../lib/UID';
import { ITextFieldModel } from '../../model/FieldModel';
import { CharCounterView } from './CharCounterView';
import { InputConfigurator, InputCreator } from './InputHelper';
import { StringInputView, IStringInputView } from './StringInputView';

export type TextInputElements = HTMLInputElement | HTMLTextAreaElement;

export class TextInputRenderer {
  public static createInput(fieldM: ITextFieldModel,
    uid: string): HTMLInputElement | HTMLTextAreaElement {
    const { multiline } = fieldM.config;

    if (multiline) {
      return InputCreator.textarea(fieldM, uid);
    }

    return InputCreator.input(fieldM, uid, 'text');
  }

  public static renderInput(fieldM: ITextFieldModel, uid: string): TextInputElements {
    const input = this.createInput(fieldM, uid);

    InputConfigurator.defaultValue(input, fieldM);
    InputConfigurator.placeholder(input, fieldM);
    InputConfigurator.lengthRules(input, fieldM);

    return input;
  }

  public static renderCount(inputE: TextInputElements,
    fieldM: ITextFieldModel): CharCounterView | undefined {
    const { config: { maxLength } } = fieldM;

    if (!maxLength) {
      return undefined;
    }

    const counter = CharCounterView.create(inputE, maxLength);

    return counter;
  }

  public static renderRoot(fieldM: ITextFieldModel,
    inputE: TextInputElements): HTMLDivElement {
    const root = document.createElement('div');
    root.classList.add('af-field-wrapper');

    root.appendChild(inputE);

    const counter = this.renderCount(inputE, fieldM);
    if (counter) {
      root.appendChild(counter.render());
    }

    return root;
  }
}

export type ITextInputView = IStringInputView;

export class TextInputView extends StringInputView implements ITextInputView {
  public static create(fieldM: ITextFieldModel): ITextInputView {
    const uid = UID.create();
    const inputE = TextInputRenderer.renderInput(fieldM, uid);
    const rootE = TextInputRenderer.renderRoot(fieldM, inputE);
    return new TextInputView(uid, inputE, rootE);
  }
}
