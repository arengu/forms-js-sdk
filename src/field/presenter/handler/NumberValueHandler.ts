import isNil from 'lodash/isNil';

import { ISyncValueHandler } from './ValueHandler';
import { INumberFieldModel, INumberFieldValue } from '../../model/FieldModel';
import { INumberInputView } from '../../view/input/NumberInputView';

export const NumberValueHandler = {
  create(inputV: INumberInputView, fieldM: INumberFieldModel): ISyncValueHandler<INumberFieldValue> {
    return {
      getValue(): INumberFieldValue {
        const strValue = inputV.getValue().trim();

        if (strValue === '') {
          return undefined;
        }

        const value = strValue.replace(',', '.');

        return value;
      },

      setDefaultValue(): void {
        const defValue = fieldM.config.defaultValue;

        if (defValue) {
          inputV.setValue(defValue.toString());
        }
      },

      setValue(custValue: INumberFieldValue): void {
        const initValue = isNil(custValue) ? '' : custValue.trim();

        const strValue = initValue.replace(',', '.');

        inputV.setValue(strValue);
      }
    };
  },
};
