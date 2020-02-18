import { IValueHandler } from './ValueHandler';
import { IURLFieldModel, IURLFieldValue } from '../../model/FieldModel';
import { URLInputView } from '../../view/input/URLInputView';
import { StringValueHandler } from './StringValueHandler';

function ensurePrefix(str: string | undefined): string | undefined {
  if (!str) {
    return str;
  }

  return /^https?:\/\//i.test(str) ? str : `http://${str}`;
}

export const UrlValueHandler: IValueHandler<IURLFieldModel,
  URLInputView, IURLFieldValue> = {
  async getValue(inputV: URLInputView, fieldM: IURLFieldModel):
    Promise<IURLFieldValue> {
    const cleanValue = await StringValueHandler.getValue(inputV, fieldM);

    return ensurePrefix(cleanValue);
  },

  setValue(inputV: URLInputView, value: IURLFieldValue, fieldM: IURLFieldModel): void {
    const newValue = ensurePrefix(value);

    StringValueHandler.setValue(inputV, newValue, fieldM);
  }
};
