import isNil from 'lodash/isNil';

import { IValueHandler } from './ValueHandler';
import { IURLFieldModel, IURLFieldValue } from '../../model/FieldModel';
import { IURLInputView } from '../../view/input/URLInputView';
import { StringValueHandler } from './StringValueHandler';

function ensurePrefix(str: string): string {
  return str.match(/^https?:\/\//i) ? str : `http://${str}`;
}

export const UrlValueHandler: IValueHandler<IURLFieldModel,
  IURLInputView, IURLFieldValue> = {
  async getValue(inputV: IURLInputView, fieldM: IURLFieldModel):
    Promise<IURLFieldValue> {
    const cleanValue = await StringValueHandler.getValue(inputV, fieldM);

    return isNil(cleanValue)
      ? undefined
      : ensurePrefix(cleanValue);
  },
};
