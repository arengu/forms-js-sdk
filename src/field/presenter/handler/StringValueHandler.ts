import { IFieldModel, ISingleFieldValue } from '../../model/FieldModel';
import { IInputView } from '../../view/InputView';
import { IValueHandler } from './ValueHandler';

/**
 * Handles values when its associated InputView always return a string:
 * trims value and returns null when the string is empty
 */
export const StringValueHandler: IValueHandler<IFieldModel,
  IInputView<string>, ISingleFieldValue> = {
  async getValue(inputV: IInputView<string>): Promise<ISingleFieldValue> {
    const origValue = await inputV.getValue();

    if (origValue === null) {
      return null;
    }

    const trimValue = origValue.trim();

    return trimValue || null;
  },
};
