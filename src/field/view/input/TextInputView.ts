import { ITextFieldModel } from '../../model/FieldModel';
import { CharCounterView } from './CharCounterView';
import { InputConfigurator, InputCreator } from './InputHelper';
import { StringInputView, IStringInputView } from './StringInputView';

export type TextInputElements = HTMLInputElement | HTMLTextAreaElement;

export const TextInputRenderer = {
  createInput(fieldM: ITextFieldModel): HTMLInputElement | HTMLTextAreaElement {
    const { multiline } = fieldM.config;

    if (multiline) {
      return InputCreator.textarea(fieldM);
    }

    return InputCreator.input(fieldM, 'text');
  },

  renderInput(fieldM: ITextFieldModel): TextInputElements {
    const input = this.createInput(fieldM);

    InputConfigurator.defaultValue(input, fieldM);
    InputConfigurator.placeholder(input, fieldM);
    InputConfigurator.lengthRules(input, fieldM);

    return input;
  },

  renderCount(inputE: TextInputElements,
    fieldM: ITextFieldModel): CharCounterView | undefined {
    const { config: { maxLength } } = fieldM;

    if (!maxLength) {
      return undefined;
    }

    const counter = CharCounterView.create(inputE, maxLength);

    return counter;
  },

  renderRoot(fieldM: ITextFieldModel,
    inputE: TextInputElements): HTMLDivElement {
    const root = document.createElement('div');
    root.classList.add('af-field-wrapper');

    root.appendChild(inputE);

    const counter = this.renderCount(inputE, fieldM);
    if (counter) {
      root.appendChild(counter.render());
    }

    return root;
  },
};

export type ITextInputView = IStringInputView;

export class TextInputView extends StringInputView implements ITextInputView {
  public static create(fieldM: ITextFieldModel): ITextInputView {
    const inputE = TextInputRenderer.renderInput(fieldM);
    const rootE = TextInputRenderer.renderRoot(fieldM, inputE);
    return new TextInputView(inputE, rootE);
  }
}
