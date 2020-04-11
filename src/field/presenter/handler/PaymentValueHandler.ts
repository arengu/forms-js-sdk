import { IPaymentFieldValue } from '../../model/FieldModel';
import { IValueHandler } from './ValueHandler';
import { IPaymentInputView } from '../../view/input/PaymentInputView';

export const PaymentValueHandler = {
  create(inputV: IPaymentInputView): IValueHandler<IPaymentFieldValue> {
    return {
      async getValue(): Promise<IPaymentFieldValue> {
        await inputV.processCard();
        const token = inputV.getToken();
        return token ? token.id : undefined;
      },

      setValue(): void {
        console.error('Setting a card is not allowed.');
      }
    };
  },
};
