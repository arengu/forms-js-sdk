import { IValueHandler } from './ValueHandler';
import { IURLFieldModel, IURLFieldValue } from '../../model/FieldModel';
import { IURLInputView } from '../../view/input/URLInputView';
import { StringValueHandler } from './StringValueHandler';

function ensurePrefix(str: string | undefined): string | undefined {
  if (!str) {
    return str;
  }

  return /^https?:\/\//i.test(str) ? str : `http://${str}`;
}

export const UrlValueHandler: IValueHandler<IURLFieldModel,
  IURLInputView, IURLFieldValue> = {
  async getValue(inputV: IURLInputView, fieldM: IURLFieldModel):
    Promise<IURLFieldValue> {
    const cleanValue = await StringValueHandler.getValue(inputV, fieldM);

    return ensurePrefix(cleanValue);
  },

  setValue(inputV: IURLInputView, value: IURLFieldValue): void {
    const newValue = ensurePrefix(value);

    StringValueHandler.setValue(inputV, newValue);
  }
};
