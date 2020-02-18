import { Messages } from '../../lib/Messages';
import { FieldType, IFieldModel } from '../model/FieldModel';
import { IFieldPresenterListener, IFieldPresenter, FieldPresenter } from './FieldPresenter';
import {
  URLFieldFactory, BooleanFieldFactory, ChoiceFieldFactory, DateFieldFactory,
  DropdownFieldFactory, EmailFieldFactory, LegalFieldFactory, NumberFieldFactory,
  PaymentFieldFactory, PasswordFieldFactory, TelFieldFactory, TextFieldFactory,
} from '../FieldFactory';

export abstract class FieldPresenterFactory {
  public static create(model: IFieldModel, listener: IFieldPresenterListener,
    messages: Messages): IFieldPresenter {
    switch (model.type) {
      case FieldType.BOOLEAN:
        return FieldPresenter.create(
          model, listener, messages, BooleanFieldFactory,
        );
      case FieldType.CHOICE:
        return FieldPresenter.create(
          model, listener, messages, ChoiceFieldFactory,
        );
      case FieldType.DATE:
        return FieldPresenter.create(
          model, listener, messages, DateFieldFactory,
        );
      case FieldType.DROPDOWN:
        return FieldPresenter.create(
          model, listener, messages, DropdownFieldFactory,
        );
      case FieldType.EMAIL:
        return FieldPresenter.create(
          model, listener, messages, EmailFieldFactory,
        );
      case FieldType.LEGAL:
        return FieldPresenter.create(
          model, listener, messages, LegalFieldFactory,
        );
      case FieldType.NUMBER:
        return FieldPresenter.create(
          model, listener, messages, NumberFieldFactory,
        );
      case FieldType.PAYMENT:
        return FieldPresenter.create(
          model, listener, messages, PaymentFieldFactory,
        );
      case FieldType.PASSWORD:
        return FieldPresenter.create(
          model, listener, messages, PasswordFieldFactory,
        );
      case FieldType.TEL:
        return FieldPresenter.create(
          model, listener, messages, TelFieldFactory,
        );
      case FieldType.TEXT:
        return FieldPresenter.create(
          model, listener, messages, TextFieldFactory,
        );
      case FieldType.URL:
        return FieldPresenter.create(
          model, listener, messages, URLFieldFactory,
        );
      default:
        throw new Error('Unexpected field model');
    }
  }
}
