import {
  IBooleanFieldModel, IBooleanFieldValue, IChoiceFieldModel, IChoiceFieldValue, IDateFieldModel,
  IDateFieldValue, IDropdownFieldModel, IDropdownFieldValue, IEmailFieldModel, IEmailFieldValue,
  ILegalFieldModel, ILegalFieldValue, INumberFieldModel, INumberFieldValue, IPasswordFieldModel,
  IPasswordFieldValue, IPaymentFieldModel, IPaymentFieldValue, ITelFieldModel, ITelFieldValue,
  ITextFieldModel, ITextFieldValue, IURLFieldModel, IURLFieldValue, IFieldModel, IFieldValue,
} from './model/FieldModel';

import { IValueHandler } from './presenter/handler/ValueHandler';
import { PasswordValueHandler } from './presenter/handler/PasswordValueHandler';

import { CustomValidations } from './presenter/validator/CustomValidations';
import { FieldFormats } from './presenter/validator/FieldFormats';
import { FieldRules } from './presenter/validator/FieldRules';
import { IFieldValidator, FieldValidator } from './presenter/validator/FieldValidator';

import { IInputViewListener, IInputView } from './view/InputView';
import { IBooleanInputView, BooleanInputView } from './view/input/BooleanInputView';
import { IChoiceInputView, ChoiceInputView } from './view/input/ChoiceInputView';
import { IDateInputView, DateInputView } from './view/input/DateInputView';
import { IDropdownInputView, DropdownInputView } from './view/input/DropdownInputView';
import { IEmailInputView, EmailInputView } from './view/input/EmailInputView';
import { ILegalInputView, LegalInputView } from './view/input/LegalInputView';
import { INumberInputView, NumberInputView } from './view/input/NumberInputView';
import { IPasswordInputView, PasswordInputView } from './view/input/PasswordInputView';
import { IPaymentInputView, PaymentInputView } from './view/input/PaymentInputView';
import { ITelInputView, TelInputView } from './view/input/TelInputView';
import { ITextInputView, TextInputView } from './view/input/TextInputView';
import { IURLInputView, URLInputView } from './view/input/URLInputView';
import { StringValueHandler } from './presenter/handler/StringValueHandler';
import { DummyValueHandler } from './presenter/handler/DummyValueHandler';
import { PaymentValueHandler } from './presenter/handler/PaymentValueHandler';
import { UrlValueHandler } from './presenter/handler/UrlValueHandler';

export interface IFieldFactory<FM extends IFieldModel, IV extends IInputView, FVA extends IFieldValue> {
  createInputView(fieldM: FM, uid: string, inputL: IInputViewListener): IV;
  createValidator(): IFieldValidator<FM, IV, FVA>;
  createHandler(): IValueHandler<FM, IV, FVA>;
}

export const BooleanFieldFactory: IFieldFactory<IBooleanFieldModel,
  IBooleanInputView, IBooleanFieldValue> = {
  createInputView(fieldM: IBooleanFieldModel, uid: string, inputL: IInputViewListener): IBooleanInputView {
    return BooleanInputView.create(fieldM, inputL);
  },

  createValidator(): IFieldValidator<IBooleanFieldModel, IBooleanInputView, IBooleanFieldValue> {
    return FieldValidator.create([
      FieldRules.require,
    ]);
  },
  createHandler: DummyValueHandler.create,
};

export const ChoiceFieldFactory: IFieldFactory<IChoiceFieldModel,
  IChoiceInputView, IChoiceFieldValue> = {
  createInputView(fieldM: IChoiceFieldModel, uid: string, inputL: IInputViewListener): IChoiceInputView {
    return ChoiceInputView.create(fieldM, inputL);
  },
  createValidator(): IFieldValidator<IChoiceFieldModel, IChoiceInputView, IChoiceFieldValue> {
    return FieldValidator.create([
      FieldRules.multiple,
    ]);
  },
  createHandler: DummyValueHandler.create,
};

export const DateFieldFactory: IFieldFactory<IDateFieldModel,
  IDateInputView, IDateFieldValue> = {
  createInputView: DateInputView.create,

  createValidator(): IFieldValidator<IDateFieldModel, IDateInputView, IDateFieldValue> {
    return FieldValidator.create([
      FieldRules.require,
    ]);
  },
  createHandler(): IValueHandler<IDateFieldModel, IDateInputView, IDateFieldValue> {
    return StringValueHandler;
  },
};

export const DropdownFieldFactory: IFieldFactory<IDropdownFieldModel,
  IDropdownInputView, IDropdownFieldValue> = {
  createInputView(fieldM: IDropdownFieldModel, uid: string, inputL: IInputViewListener): IDropdownInputView {
    return DropdownInputView.create(fieldM, inputL);
  },

  createValidator(): IFieldValidator<IDropdownFieldModel, IDropdownInputView, IDropdownFieldValue> {
    return FieldValidator.create([
      FieldRules.multiple,
    ]);
  },
  createHandler: DummyValueHandler.create,
};

export const EmailFieldFactory: IFieldFactory<IEmailFieldModel,
  IEmailInputView, IEmailFieldValue> = {
  createInputView(fieldM: IEmailFieldModel, uid: string, inputL: IInputViewListener,
  ): IEmailInputView {
    return EmailInputView.create(fieldM, uid, inputL);
  },

  createValidator(): IFieldValidator<IEmailFieldModel, IEmailInputView, IEmailFieldValue> {
    return FieldValidator.create([
      FieldRules.require,
      FieldFormats.email,
    ]);
  },
  createHandler(): IValueHandler<IEmailFieldModel, IEmailInputView, IEmailFieldValue> {
    return StringValueHandler;
  },
};

export const LegalFieldFactory: IFieldFactory<ILegalFieldModel,
  ILegalInputView, ILegalFieldValue> = {
  createInputView(fieldM: ILegalFieldModel, uid: string, inputL: IInputViewListener,
  ): ILegalInputView {
    return LegalInputView.create(fieldM, uid, inputL);
  },

  createValidator(): IFieldValidator<ILegalFieldModel, ILegalInputView, ILegalFieldValue> {
    return FieldValidator.create([
      CustomValidations.legal,
    ]);
  },
  createHandler(): IValueHandler<ILegalFieldModel, ILegalInputView, ILegalFieldValue> {
    return DummyValueHandler.create();
  },
};

export const NumberFieldFactory: IFieldFactory<INumberFieldModel,
  INumberInputView, INumberFieldValue> = {
  createInputView(fieldM: INumberFieldModel, uid: string, inputL: IInputViewListener,
  ): INumberInputView {
    return NumberInputView.create(fieldM, uid, inputL);
  },

  createValidator(): IFieldValidator<INumberFieldModel, INumberInputView, INumberFieldValue> {
    return FieldValidator.create([
      FieldRules.require,
      CustomValidations.number,
      FieldRules.minValue,
      FieldRules.maxValue,
    ]);
  },
  createHandler(): IValueHandler<INumberFieldModel, INumberInputView, INumberFieldValue> {
    return StringValueHandler;
  },
};

export const PasswordFieldFactory: IFieldFactory<IPasswordFieldModel,
  IPasswordInputView, IPasswordFieldValue> = {
  createInputView(fieldM: IPasswordFieldModel, uid: string, inputL: IInputViewListener,
  ): IPasswordInputView {
    return PasswordInputView.create(fieldM, uid, inputL);
  },

  createValidator(): IFieldValidator<IPasswordFieldModel, IPasswordInputView, IPasswordFieldValue> {
    return FieldValidator.create([
      FieldRules.require,
    ]);
  },
  createHandler(): IValueHandler<IPasswordFieldModel, IPasswordInputView, IPasswordFieldValue> {
    return PasswordValueHandler;
  },
};

export const PaymentFieldFactory: IFieldFactory<IPaymentFieldModel,
  IPaymentInputView, IPaymentFieldValue> = {
  createInputView(fieldM: IPaymentFieldModel, uid: string, inputL: IInputViewListener,
  ): IPaymentInputView {
    return PaymentInputView.create(fieldM, uid, inputL);
  },

  createValidator(): IFieldValidator<IPaymentFieldModel, IPaymentInputView, IPaymentFieldValue> {
    return FieldValidator.create([
      CustomValidations.payment,
    ]);
  },
  createHandler(): IValueHandler<IPaymentFieldModel, IPaymentInputView, IPaymentFieldValue> {
    return PaymentValueHandler;
  },
};

export const TelFieldFactory: IFieldFactory<ITelFieldModel,
  ITelInputView, ITelFieldValue> = {
  createInputView(fieldM: ITelFieldModel, uid: string, inputL: IInputViewListener, ): ITelInputView {
    return TelInputView.create(fieldM, uid, inputL);
  },

  createValidator(): IFieldValidator<ITelFieldModel, ITelInputView, ITelFieldValue> {
    return FieldValidator.create([
      FieldRules.require,
      FieldRules.minLength,
      FieldRules.maxLength,
    ]);
  },
  createHandler(): IValueHandler<ITelFieldModel, ITelInputView, ITelFieldValue> {
    return StringValueHandler;
  },
};

export const TextFieldFactory: IFieldFactory<ITextFieldModel,
  ITextInputView, ITextFieldValue> = {
  createInputView(fieldM: ITextFieldModel, uid: string, inputL: IInputViewListener,
  ): ITextInputView {
    return TextInputView.create(fieldM, uid, inputL);
  },

  createValidator(): IFieldValidator<ITextFieldModel, ITextInputView, ITextFieldValue> {
    return FieldValidator.create([
      FieldRules.require,
      FieldRules.minLength,
      FieldRules.maxLength,
    ]);
  },
  createHandler(): IValueHandler<ITextFieldModel, ITextInputView, ITextFieldValue> {
    return StringValueHandler;
  },
};

export const URLFieldFactory: IFieldFactory<IURLFieldModel,
  IURLInputView, IURLFieldValue> = {
  createInputView(fieldM: IURLFieldModel, uid: string, inputL: IInputViewListener, ): IURLInputView {
    return URLInputView.create(fieldM, uid, inputL);
  },

  createValidator(): IFieldValidator<IURLFieldModel, IURLInputView, IURLFieldValue> {
    return FieldValidator.create([
      FieldRules.require,
      FieldFormats.url,
    ]);
  },
  createHandler(): IValueHandler<IURLFieldModel, IURLInputView, IURLFieldValue> {
    return UrlValueHandler;
  },
};
