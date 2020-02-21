import { Messages } from '../../lib/Messages';
import { FieldType, IFieldModel, IFieldValue } from '../model/FieldModel';
import { IGenericFieldPresenter, GenericFieldPresenter } from './GenericFieldPresenter';
import {
  URLFieldFactory, BooleanFieldFactory, ChoiceFieldFactory, DateFieldFactory,
  DropdownFieldFactory, EmailFieldFactory, LegalFieldFactory, NumberFieldFactory,
  PaymentFieldFactory, PasswordFieldFactory, TelFieldFactory, TextFieldFactory,
} from '../FieldFactory';
import { FieldError } from '../../error/InvalidFields';

export type IFieldPresenter = IGenericFieldPresenter<IFieldValue>;

export interface IFieldPresenterListener {
  onValidField(this: this, fieldP: IFieldPresenter): void;
  onInvalidField(this: this, error: FieldError, message: string, fieldP: IFieldPresenter): void;
}

export abstract class FieldPresenter {
  public static create(model: IFieldModel, listener: IFieldPresenterListener,
    messages: Messages): IFieldPresenter {
    switch (model.type) {
      case FieldType.BOOLEAN:
        return GenericFieldPresenter.create(
          model, listener, messages, BooleanFieldFactory,
        );
      case FieldType.CHOICE:
        return GenericFieldPresenter.create(
          model, listener, messages, ChoiceFieldFactory,
        );
      case FieldType.DATE:
        return GenericFieldPresenter.create(
          model, listener, messages, DateFieldFactory,
        );
      case FieldType.DROPDOWN:
        return GenericFieldPresenter.create(
          model, listener, messages, DropdownFieldFactory,
        );
      case FieldType.EMAIL:
        return GenericFieldPresenter.create(
          model, listener, messages, EmailFieldFactory,
        );
      case FieldType.LEGAL:
        return GenericFieldPresenter.create(
          model, listener, messages, LegalFieldFactory,
        );
      case FieldType.NUMBER:
        return GenericFieldPresenter.create(
          model, listener, messages, NumberFieldFactory,
        );
      case FieldType.PAYMENT:
        return GenericFieldPresenter.create(
          model, listener, messages, PaymentFieldFactory,
        );
      case FieldType.PASSWORD:
        return GenericFieldPresenter.create(
          model, listener, messages, PasswordFieldFactory,
        );
      case FieldType.TEL:
        return GenericFieldPresenter.create(
          model, listener, messages, TelFieldFactory,
        );
      case FieldType.TEXT:
        return GenericFieldPresenter.create(
          model, listener, messages, TextFieldFactory,
        );
      case FieldType.URL:
        return GenericFieldPresenter.create(
          model, listener, messages, URLFieldFactory,
        );
      default:
        throw new Error('Unexpected field model');
    }
  }
}
