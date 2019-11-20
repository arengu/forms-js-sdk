import isNil from 'lodash/isNil';

import { IFieldModel, IStringFieldValue } from '../../model/FieldModel';
import { IInputView } from '../../view/InputView';
import { IValueHandler } from './ValueHandler';

export type IStringFieldView = IInputView<string>;
/**
 * Handles values when its associated InputView always return a string:
 * trims value and returns undefined when the string is empty
 */
export const StringValueHandler: IValueHandler<IFieldModel,
  IStringFieldView, IStringFieldValue> = {
  async getValue(inputV: IStringFieldView): Promise<IStringFieldValue> {
    const origValue = await inputV.getValue();

    if (isNil(origValue)) {
      return undefined;
    }

    const trimValue = origValue.trim();

    return trimValue === '' ? undefined : trimValue;
  },

  async setValue(
    inputV: IStringFieldView, value: IStringFieldValue,
  ): Promise<void> {
    inputV.setValue(isNil(value) ? '' : value.trim());
  },
};
