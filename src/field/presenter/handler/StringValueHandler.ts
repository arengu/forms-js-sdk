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
  getValue(inputV: IStringInputView): IStringFieldValue {
    const value = inputV.getValue().trim();

    return value === '' ? undefined : value;
  },

  setValue(inputV: IStringInputView, value: IStringFieldValue): void {
    inputV.setValue(isNil(value) ? '' : value.trim());
  },
};
