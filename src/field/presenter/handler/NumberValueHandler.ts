import isNil from 'lodash/isNil';

import { ISyncValueHandler } from './ValueHandler';
import { INumberFieldValue } from '../../model/FieldModel';
import { INumberInputView } from '../../view/input/NumberInputView';

export const NumberValueHandler = {
  create(inputV: INumberInputView): ISyncValueHandler<INumberFieldValue> {
    return {
      getValue(): INumberFieldValue {
        const strValue = inputV.getValue().trim();

        if (strValue === '') {
          return undefined;
        }

        const value = strValue.replace(',', '.');

        return value;
      },

      setValue(custValue: INumberFieldValue): void {
        const initValue = isNil(custValue) ? '' : custValue.trim();

        const strValue = initValue.replace(',', '.');

        inputV.setValue(strValue);
      }
    };
  },
};
