import { IFormDeps } from "../../../form/FormPresenter";
import { IBooleanFieldModel, IChoiceFieldModel, IDateFieldModel, IDropdownFieldModel, IEmailFieldModel, ILegalFieldModel, INumberFieldModel, IPasswordFieldModel, IPaymentFieldModel, ITelFieldModel, ITextFieldModel, IURLFieldModel } from "../../model/FieldModel";
import { BooleanInputView } from "../../view/input/BooleanInputView";
import { ChoiceInputView } from "../../view/input/ChoiceInputView";
import { DateInputView } from "../../view/input/DateInputView";
import { DropdownInputView } from "../../view/input/DropdownInputView";
import { EmailInputView } from "../../view/input/EmailInputView";
import { LegalInputView } from "../../view/input/LegalInputView";
import { NumberInputView } from "../../view/input/NumberInputView";
import { PasswordInputView } from "../../view/input/PasswordInputView";
import { PaymentInputView } from "../../view/input/PaymentInputView";
import { TelInputView } from "../../view/input/TelInputView";
import { TextInputView } from "../../view/input/TextInputView";
import { URLInputView } from "../../view/input/URLInputView";
import { DummyValueHandler } from "../handler/DummyValueHandler";
import { PasswordValueHandler } from "../handler/PasswordValueHandler";
import { PaymentValueHandler } from "../handler/PaymentValueHandler";
import { StringValueHandler } from "../handler/StringValueHandler";
import { UrlValueHandler } from "../handler/UrlValueHandler";
import { CustomValidations } from "../validator/CustomValidations";
import { FieldFormats } from "../validator/FieldFormats";
import { FieldRules } from "../validator/FieldRules";
import { FieldValidator } from "../validator/FieldValidator";
import { IFieldPresenter } from "./FieldPresenter";
import { SimpleFieldPresenter } from "./SimpleFieldPresenter";
import { SocialFieldPresenter } from "./SocialFieldPresenter";
import { NumberValueHandler } from "../handler/NumberValueHandler";

export const FieldPresenterFactory = {
  fromBoolean(formD: IFormDeps, fieldM: IBooleanFieldModel): IFieldPresenter {
    const inputV = BooleanInputView.create(fieldM);

    const fieldVal = FieldValidator.create([
      FieldRules.require(fieldM),
    ]);

    const valueH = DummyValueHandler.create(inputV, fieldM);

    return SimpleFieldPresenter.create(formD, fieldM, inputV, fieldVal, valueH);
  },

  fromChoice(formD: IFormDeps, fieldM: IChoiceFieldModel): IFieldPresenter {
    const inputV = ChoiceInputView.create(fieldM);

    const fieldVal = FieldValidator.create([
      FieldRules.multiple(fieldM),
    ]);

    const valueH = DummyValueHandler.create(inputV, fieldM);

    return SimpleFieldPresenter.create(formD, fieldM, inputV, fieldVal, valueH);
  },

  fromDate(formD: IFormDeps, fieldM: IDateFieldModel): IFieldPresenter {
    const inputV = DateInputView.create(fieldM);

    const fieldVal = FieldValidator.create([
      FieldRules.require(fieldM),
    ]);

    const valueH = StringValueHandler.create(inputV);

    return SimpleFieldPresenter.create(formD, fieldM, inputV, fieldVal, valueH);
  },


  fromDropdown(formD: IFormDeps, fieldM: IDropdownFieldModel): IFieldPresenter {
    const inputV = DropdownInputView.create(fieldM);

    const fieldVal = FieldValidator.create([
      FieldRules.multiple(fieldM),
    ]);

    const valueH = DummyValueHandler.create(inputV, fieldM);

    return SimpleFieldPresenter.create(formD, fieldM, inputV, fieldVal, valueH);
  },

  fromEmail(formD: IFormDeps, fieldM: IEmailFieldModel): IFieldPresenter {
    const inputV = EmailInputView.create(fieldM);

    const fieldVal = FieldValidator.create([
      FieldRules.require(fieldM),
      FieldFormats.email(fieldM),
    ]);

    const valueH = StringValueHandler.create(inputV);

    return SimpleFieldPresenter.create(formD, fieldM, inputV, fieldVal, valueH);
  },

  fromLegal(formD: IFormDeps, fieldM: ILegalFieldModel): IFieldPresenter {
    const inputV = LegalInputView.create(fieldM);

    const fieldVal = FieldValidator.create([
      CustomValidations.legal(fieldM),
    ]);

    const valueH = DummyValueHandler.create(inputV, fieldM);

    return SimpleFieldPresenter.create(formD, fieldM, inputV, fieldVal, valueH);
  },

  fromNumber(formD: IFormDeps, fieldM: INumberFieldModel): IFieldPresenter {
    const inputV = NumberInputView.create(fieldM);

    const fieldVal = FieldValidator.create([
      FieldRules.require(fieldM),
      CustomValidations.number(fieldM),
      FieldRules.minValue(fieldM),
      FieldRules.maxValue(fieldM),
    ]);

    const valueH = NumberValueHandler.create(inputV);

    return SimpleFieldPresenter.create(formD, fieldM, inputV, fieldVal, valueH);
  },

  fromPassword(formD: IFormDeps, fieldM: IPasswordFieldModel): IFieldPresenter {
    const inputV = PasswordInputView.create(fieldM);

    const fieldVal = FieldValidator.create([
      FieldRules.require(fieldM),
    ]);

    const valueH = PasswordValueHandler.create(inputV, fieldM);

    return SimpleFieldPresenter.create(formD, fieldM, inputV, fieldVal, valueH);
  },

  fromPayment(formD: IFormDeps, fieldM: IPaymentFieldModel): IFieldPresenter {
    const inputV = PaymentInputView.create(fieldM);

    const fieldVal = FieldValidator.create([
      CustomValidations.payment(fieldM, inputV),
    ]);

    const valueH = PaymentValueHandler.create(inputV);

    return SimpleFieldPresenter.create(formD, fieldM, inputV, fieldVal, valueH);
  },

  fromSocial: SocialFieldPresenter.create,

  fromTel(formD: IFormDeps, fieldM: ITelFieldModel): IFieldPresenter {
    const inputV = TelInputView.create(fieldM);

    const fieldVal = FieldValidator.create([
      FieldRules.require(fieldM),
      FieldRules.minLength(fieldM),
      FieldRules.maxLength(fieldM),
    ]);

    const valueH = StringValueHandler.create(inputV);

    return SimpleFieldPresenter.create(formD, fieldM, inputV, fieldVal, valueH);
  },

  fromText(formD: IFormDeps, fieldM: ITextFieldModel): IFieldPresenter {
    const inputV = TextInputView.create(fieldM);

    const fieldVal = FieldValidator.create([
      FieldRules.require(fieldM),
      FieldRules.minLength(fieldM),
      FieldRules.maxLength(fieldM),
    ]);

    const valueH = StringValueHandler.create(inputV);

    return SimpleFieldPresenter.create(formD, fieldM, inputV, fieldVal, valueH);
  },

  fromURL(formD: IFormDeps, fieldM: IURLFieldModel): IFieldPresenter {
    const inputV = URLInputView.create(fieldM);

    const fieldVal = FieldValidator.create([
      FieldRules.require(fieldM),
      FieldFormats.url(fieldM),
    ]);

    const valueH = UrlValueHandler.create(inputV);

    return SimpleFieldPresenter.create(formD, fieldM, inputV, fieldVal, valueH);
  },
};
