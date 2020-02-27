import isNil from 'lodash/isNil';

import { IStringFieldValue } from '../../model/FieldModel';
import { IValueHandler } from './ValueHandler';
import { IStringInputView } from '../../view/input/StringInputView';

/**
 * Handles values when its associated InputView always return a string:
 * trims value and returns undefined when the string is empty
 */
export const StringValueHandler = {
  create(inputV: IStringInputView): IValueHandler<IStringFieldValue> {
    return {
      getValue(): IStringFieldValue {
        const value = inputV.getValue().trim();

        return value === '' ? undefined : value;
      },

      setValue(value: IStringFieldValue): void {
        inputV.setValue(isNil(value) ? '' : value.trim());
      }
    };
  },
};
