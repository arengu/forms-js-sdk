import { ISyncValueHandler } from './ValueHandler';
import { IURLFieldModel, IURLFieldValue } from '../../model/FieldModel';
import { StringValueHandler } from './StringValueHandler';
import { IURLInputView } from '../../view/input/URLInputView';

function ensurePrefix(str: string | undefined): string | undefined {
  if (!str) {
    return str;
  }

  return /^https?:\/\//i.test(str) ? str : `http://${str}`;
}

export const UrlValueHandler = {
  create(inputV: IURLInputView, fieldM: IURLFieldModel): ISyncValueHandler<IURLFieldValue> {
    const stringHandler = StringValueHandler.create(inputV, fieldM);

    return {
      getValue(): IURLFieldValue {
        const cleanValue = stringHandler.getValue();

        return ensurePrefix(cleanValue);
      },

      setValue(value: IURLFieldValue): void {
        const newValue = ensurePrefix(value);

        stringHandler.setValue(newValue);
      }
    };
  },
};