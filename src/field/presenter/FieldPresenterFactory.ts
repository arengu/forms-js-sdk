import { Messages } from '../../lib/Messages';
import { FieldType, IFieldModel } from '../model/FieldModel';
import { IFieldPresenterListener, IAnyFieldPresenter, FieldPresenter } from './FieldPresenter';
import {
  URLFieldFactory, BooleanFieldFactory, ChoiceFieldFactory, DateFieldFactory,
  DropdownFieldFactory, EmailFieldFactory, LegalFieldFactory, NumberFieldFactory,
  PaymentFieldFactory, PasswordFieldFactory, TelFieldFactory, TextFieldFactory,
} from '../FieldFactory';

export abstract class FieldPresenterFactory {
  public static create(fieldM: IFieldModel, fieldL: IFieldPresenterListener,
    messages: Messages): IAnyFieldPresenter {
    switch (fieldM.type) {
      case FieldType.BOOLEAN:
        return FieldPresenter.create({
          fieldM, fieldL, messages, fieldF: BooleanFieldFactory,
        });
      case FieldType.CHOICE:
        return FieldPresenter.create({
          fieldM, fieldL, messages, fieldF: ChoiceFieldFactory,
        });
      case FieldType.DATE:
        return FieldPresenter.create({
          fieldM, fieldL, messages, fieldF: DateFieldFactory,
        });
      case FieldType.DROPDOWN:
        return FieldPresenter.create({
          fieldM, fieldL, messages, fieldF: DropdownFieldFactory,
        });
      case FieldType.EMAIL:
        return FieldPresenter.create({
          fieldM, fieldL, messages, fieldF: EmailFieldFactory,
        });
      case FieldType.LEGAL:
        return FieldPresenter.create({
          fieldM, fieldL, messages, fieldF: LegalFieldFactory,
        });
      case FieldType.NUMBER:
        return FieldPresenter.create({
          fieldM, fieldL, messages, fieldF: NumberFieldFactory,
        });
      case FieldType.PAYMENT:
        return FieldPresenter.create({
          fieldM, fieldL, messages, fieldF: PaymentFieldFactory,
        });
      case FieldType.PASSWORD:
        return FieldPresenter.create({
          fieldM, fieldL, messages, fieldF: PasswordFieldFactory,
        });
      case FieldType.TEL:
        return FieldPresenter.create({
          fieldM, fieldL, messages, fieldF: TelFieldFactory,
        });
      case FieldType.TEXT:
        return FieldPresenter.create({
          fieldM, fieldL, messages, fieldF: TextFieldFactory,
        });
      case FieldType.URL:
        return FieldPresenter.create({
          fieldM, fieldL, messages, fieldF: URLFieldFactory,
        });
      default:
        throw new Error('Unexpected field model');
    }
  }
}
