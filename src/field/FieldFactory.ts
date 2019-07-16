import {
  IBooleanFieldModel, IBooleanFieldValue, IChoiceFieldModel, IChoiceFieldValue, IDateFieldModel,
  IDateFieldValue, IDropdownFieldModel, IDropdownFieldValue, IEmailFieldModel, IEmailFieldValue,
  ILegalFieldModel, ILegalFieldValue, INumberFieldModel, INumberFieldValue, IPasswordFieldModel,
  IPasswordFieldValue, IPaymentFieldModel, IPaymentFieldValue, ITelFieldModel, ITelFieldValue,
  ITextFieldModel, ITextFieldValue, IURLFieldModel, IURLFieldValue,
} from './model/FieldModel';

import { IFieldFactory } from './presenter/FieldPresenter';

import { IValueHandler } from './presenter/handler/ValueHandler';
import { PasswordValueHandler } from './presenter/handler/PasswordValueHandler';

import { CustomValidations } from './presenter/validator/CustomValidations';
import { FieldFormats } from './presenter/validator/FieldFormats';
import { FieldRules } from './presenter/validator/FieldRules';
import { IFieldValidator, FieldValidator } from './presenter/validator/FieldValidator';

import {
  IBooleanFieldView, IFieldViewListener, FieldView, IChoiceFieldView, IDateFieldView,
  IDropdownFieldView, IEmailFieldView, ILegalFieldView, INumberFieldView, IPasswordFieldView,
  IPaymentFieldView, ITelFieldView, ITextFieldView, IURLFieldView,
} from './view/FieldView';

import { IInputViewListener } from './view/InputView';
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

export const BooleanFieldFactory: IFieldFactory<IBooleanFieldModel,
  IBooleanFieldView, IBooleanInputView, IBooleanFieldValue> = {
  createInputView(fieldM: IBooleanFieldModel, inputL: IInputViewListener): IBooleanInputView {
    return BooleanInputView.create(fieldM, inputL);
  },
  createFieldView(fieldM: IBooleanFieldModel, fieldL: IFieldViewListener): IBooleanFieldView {
    return FieldView.create({ fieldM, fieldL, fieldF: this });
  },
  createValidator(): IFieldValidator<IBooleanFieldModel, IBooleanInputView, IBooleanFieldValue> {
    return FieldValidator.create([
      FieldRules.require,
    ]);
  },
  createHandler(): IValueHandler<IBooleanFieldModel, IBooleanInputView, IBooleanFieldValue> {
    return DummyValueHandler.create();
  },
};

export const ChoiceFieldFactory: IFieldFactory<IChoiceFieldModel,
  IChoiceFieldView, IChoiceInputView, IChoiceFieldValue> = {
  createInputView(fieldM: IChoiceFieldModel, inputL: IInputViewListener): IChoiceInputView {
    return ChoiceInputView.create(fieldM, inputL);
  },
  createFieldView(fieldM: IChoiceFieldModel, fieldL: IFieldViewListener): IChoiceFieldView {
    return FieldView.create({ fieldM, fieldL, fieldF: this });
  },
  createValidator(): IFieldValidator<IChoiceFieldModel, IChoiceInputView, IChoiceFieldValue> {
    return FieldValidator.create([
      FieldRules.multiple,
    ]);
  },
  createHandler(): IValueHandler<IChoiceFieldModel, IChoiceInputView, IChoiceFieldValue> {
    return DummyValueHandler.create();
  },
};

export const DateFieldFactory: IFieldFactory<IDateFieldModel,
  IDateFieldView, IDateInputView, IDateFieldValue> = {
  createInputView(fieldM: IDateFieldModel, inputL: IInputViewListener,
    uid: string): IDateInputView {
    return DateInputView.create(fieldM, uid, inputL);
  },
  createFieldView(fieldM: IDateFieldModel, fieldL: IFieldViewListener): IDateFieldView {
    return FieldView.create({ fieldM, fieldL, fieldF: this });
  },
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
  IDropdownFieldView, IDropdownInputView, IDropdownFieldValue> = {
  createInputView(fieldM: IDropdownFieldModel, inputL: IInputViewListener): IDropdownInputView {
    return DropdownInputView.create(fieldM, inputL);
  },
  createFieldView(fieldM: IDropdownFieldModel, fieldL: IFieldViewListener): IDropdownFieldView {
    return FieldView.create({ fieldM, fieldL, fieldF: this });
  },
  createValidator(): IFieldValidator<IDropdownFieldModel, IDropdownInputView, IDropdownFieldValue> {
    return FieldValidator.create([
      FieldRules.multiple,
    ]);
  },
  createHandler(): IValueHandler<IDropdownFieldModel, IDropdownInputView, IDropdownFieldValue> {
    return DummyValueHandler.create();
  },
};

export const EmailFieldFactory: IFieldFactory<IEmailFieldModel,
  IEmailFieldView, IEmailInputView, IEmailFieldValue> = {
  createInputView(fieldM: IEmailFieldModel, inputL: IInputViewListener,
    uid: string): IEmailInputView {
    return EmailInputView.create(fieldM, uid, inputL);
  },
  createFieldView(fieldM: IEmailFieldModel, fieldL: IFieldViewListener): IEmailFieldView {
    return FieldView.create({ fieldM, fieldL, fieldF: this });
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
  ILegalFieldView, ILegalInputView, ILegalFieldValue> = {
  createInputView(fieldM: ILegalFieldModel, inputL: IInputViewListener,
    uid: string): ILegalInputView {
    return LegalInputView.create(fieldM, uid, inputL);
  },
  createFieldView(fieldM: ILegalFieldModel, fieldL: IFieldViewListener): ILegalFieldView {
    return FieldView.create({ fieldM, fieldL, fieldF: this });
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
  INumberFieldView, INumberInputView, INumberFieldValue> = {
  createInputView(fieldM: INumberFieldModel, inputL: IInputViewListener,
    uid: string): INumberInputView {
    return NumberInputView.create(fieldM, uid, inputL);
  },
  createFieldView(fieldM: INumberFieldModel, fieldL: IFieldViewListener): INumberFieldView {
    return FieldView.create({ fieldM, fieldL, fieldF: this });
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
  IPasswordFieldView, IPasswordInputView, IPasswordFieldValue> = {
  createInputView(fieldM: IPasswordFieldModel, inputL: IInputViewListener,
    uid: string): IPasswordInputView {
    return PasswordInputView.create(fieldM, uid, inputL);
  },
  createFieldView(fieldM: IPasswordFieldModel, fieldL: IFieldViewListener): IPasswordFieldView {
    return FieldView.create({ fieldM, fieldL, fieldF: this });
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
  IPaymentFieldView, IPaymentInputView, IPaymentFieldValue> = {
  createInputView(fieldM: IPaymentFieldModel, inputL: IInputViewListener,
    uid: string): IPaymentInputView {
    return PaymentInputView.create(fieldM, uid, inputL);
  },
  createFieldView(fieldM: IPaymentFieldModel, fieldL: IFieldViewListener): IPaymentFieldView {
    return FieldView.create({ fieldM, fieldL, fieldF: this });
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
  ITelFieldView, ITelInputView, ITelFieldValue> = {
  createInputView(fieldM: ITelFieldModel, inputL: IInputViewListener, uid: string): ITelInputView {
    return TelInputView.create(fieldM, uid, inputL);
  },
  createFieldView(fieldM: ITelFieldModel, fieldL: IFieldViewListener): ITelFieldView {
    return FieldView.create({ fieldM, fieldL, fieldF: this });
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
  ITextFieldView, ITextInputView, ITextFieldValue> = {
  createInputView(fieldM: ITextFieldModel, inputL: IInputViewListener,
    uid: string): ITextInputView {
    return TextInputView.create(fieldM, uid, inputL);
  },
  createFieldView(fieldM: ITextFieldModel, fieldL: IFieldViewListener): ITextFieldView {
    return FieldView.create({ fieldM, fieldL, fieldF: this });
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
  IURLFieldView, IURLInputView, IURLFieldValue> = {
  createInputView(fieldM: IURLFieldModel, inputL: IInputViewListener, uid: string): IURLInputView {
    return URLInputView.create(fieldM, uid, inputL);
  },
  createFieldView(fieldM: IURLFieldModel, fieldL: IFieldViewListener): IURLFieldView {
    return FieldView.create({ fieldM, fieldL, fieldF: this });
  },
  createValidator(): IFieldValidator<IURLFieldModel, IURLInputView, IURLFieldValue> {
    return FieldValidator.create([
      FieldRules.require,
      FieldFormats.url,
    ]);
  },
  createHandler(): IValueHandler<IURLFieldModel, IURLInputView, IURLFieldValue> {
    return StringValueHandler;
  },
};
