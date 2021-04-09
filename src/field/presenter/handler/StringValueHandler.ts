import isNil from 'lodash/isNil';

import { IFieldModel, IStringFieldValue } from '../../model/FieldModel';
import { ISyncValueHandler } from './ValueHandler';
import { IStringInputView } from '../../view/input/StringInputView';

type IStringFieldModel = IFieldModel & {
  config: {
    defaultValue?: string;
  };
}

/**
 * Handles values when its associated InputView always return a string:
 * trims value and returns undefined when the string is empty
 */
export const StringValueHandler = {
  create(inputV: IStringInputView, fieldM: IStringFieldModel): ISyncValueHandler<IStringFieldValue> {
    return {
      getValue(): IStringFieldValue {
        const value = inputV.getValue().trim();

        return value === '' ? undefined : value;
      },

      getDefaultValue(): IStringFieldValue {
        const defValue = fieldM.config.defaultValue;

        return defValue === '' ? undefined : defValue;
      },

      setValue(value: IStringFieldValue): void {
        inputV.setValue(isNil(value) ? '' : value.trim());
      }
    };
  },
};
