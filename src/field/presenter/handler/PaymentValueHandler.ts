import { IPaymentFieldModel, IPaymentFieldValue } from '../../model/FieldModel';
import { IValueHandler } from './ValueHandler';
import { IPaymentInputView } from '../../view/input/PaymentInputView';

export const PaymentValueHandler: IValueHandler<IPaymentFieldModel,
  IPaymentInputView, IPaymentFieldValue> = {
  async getValue(inputV: IPaymentInputView): Promise<IPaymentFieldValue> {
    if (inputV.isEmpty()) {
      return undefined;
    }

    await inputV.processCard();
    const token = inputV.getToken();
    return token ? token.id : undefined;
  },

  setValue(): void {
    console.error('Setting a card is not allowed.');
  },
};
