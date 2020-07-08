import { FieldError } from '../../../error/InvalidFields';
import { IFormDeps } from '../../../form/FormPresenter';
import { IFormData } from '../../../form/model/SubmissionModel';
import { FieldType, IFieldModel, IFieldValue } from '../../model/FieldModel';
import { IFieldValidationResult } from '../validator/FieldValidator';
import { FieldPresenterFactory } from './FieldPresenterFactory';
import { IComponentPresenter } from '../../../component/ComponentPresenter';
import { ISocialFieldPresenter } from './SocialFieldPresenter';
import { IFormStyle } from '../../../form/model/FormStyle';

export interface IFieldPresenter extends IComponentPresenter {
  getFieldId(this: this): string;
  getValue(this: this): Promise<IFieldValue>;

  isDynamic(this: this): boolean;
  updateField(this: this, data: IFormData): void;
  onUpdateStyle(style: IFormStyle): void;

  validate(this: this): Promise<IFieldValidationResult>;

  handleFieldError(this: this, err: FieldError): void;
}

export interface IFieldPresenterListener {
  onValidField?(this: this, fieldP: IFieldPresenter): void;
  onInvalidField?(this: this, error: FieldError, message: string, fieldP: IFieldPresenter): void;
  onSocialLogin?(this: this, fieldP: ISocialFieldPresenter): void;
}

export const FieldPresenter = {
  create(formD: IFormDeps, fieldM: IFieldModel): IFieldPresenter {
    switch (fieldM.type) {
      case FieldType.BOOLEAN:
        return FieldPresenterFactory.fromBoolean(formD, fieldM);
      case FieldType.CHOICE:
        return FieldPresenterFactory.fromChoice(formD, fieldM);
      case FieldType.DATE:
        return FieldPresenterFactory.fromDate(formD, fieldM);
      case FieldType.DROPDOWN:
        return FieldPresenterFactory.fromDropdown(formD, fieldM);
      case FieldType.EMAIL:
        return FieldPresenterFactory.fromEmail(formD, fieldM);
      case FieldType.LEGAL:
        return FieldPresenterFactory.fromLegal(formD, fieldM);
      case FieldType.NUMBER:
        return FieldPresenterFactory.fromNumber(formD, fieldM);
      case FieldType.PAYMENT:
        return FieldPresenterFactory.fromPayment(formD, fieldM);
      case FieldType.PASSWORD:
        return FieldPresenterFactory.fromPassword(formD, fieldM);
      case FieldType.SOCIAL:
        return FieldPresenterFactory.fromSocial(formD, fieldM);
      case FieldType.TEL:
        return FieldPresenterFactory.fromTel(formD, fieldM);
      case FieldType.TEXT:
        return FieldPresenterFactory.fromText(formD, fieldM);
      case FieldType.URL:
        return FieldPresenterFactory.fromURL(formD, fieldM);
    }
  },
};
