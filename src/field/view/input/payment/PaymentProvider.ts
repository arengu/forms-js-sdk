import { IPresenter } from "../../../../core/BaseTypes";
import { IExtendedFormStyle } from "../../../../form/model/FormStyle";
import { IMagicResolver } from "../../../../lib/MagicResolver";
import { IPaymentFieldModel, IPaymentFieldValue } from "../../../model/FieldModel";
import { IInputViewListener } from "../../InputView";
import { StripePaymentProvider } from "./stripe/StripePaymentProvider";

export enum PaymentDetailsState {
  UNKNOWN = 'UNKNOWN',
  EMPTY = 'EMPTY',
  INCOMPLETE = 'INCOMPLETE',
  INVALID = 'INVALID',
  VALID = 'VALID',
}

export interface IPaymentProvider extends IPresenter {
  onUpdateStyle(style: IExtendedFormStyle): void;
  updateContent(resolver: IMagicResolver): void;

  getState(): PaymentDetailsState;
  getValue(): Promise<IPaymentFieldValue>;

  authenticate(data: object): Promise<void>;

  listen(listener: IInputViewListener): void;

  block(): void;
  unblock(): void;
}

export const PaymentProvider = {
  create(fieldM: IPaymentFieldModel, style: IExtendedFormStyle): IPaymentProvider {
    return StripePaymentProvider.create(fieldM, style);
  }
}
