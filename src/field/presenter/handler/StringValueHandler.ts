import isNil from 'lodash/isNil';

import { IFieldModel, IStringFieldValue } from '../../model/FieldModel';
import { IValueHandler } from './ValueHandler';
import { IStringInputView } from '../../view/input/StringInputView';

/**
 * Handles values when its associated InputView always return a string:
 * trims value and returns undefined when the string is empty
 */
export const StringValueHandler: IValueHandler<IFieldModel,
  IStringInputView, IStringFieldValue> = {
  async getValue(inputV: IStringInputView): Promise<IStringFieldValue> {
    const origValue = await inputV.getValue();

    if (isNil(origValue)) {
      return undefined;
    }

    const trimValue = origValue.trim();

    return trimValue === '' ? undefined : trimValue;
  },

  async setValue(
    inputV: IStringInputView, value: IStringFieldValue,
  ): Promise<void> {
    inputV.setValue(isNil(value) ? '' : value.trim());
  },
};
