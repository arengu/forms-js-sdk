import { IMetaDataModel } from './MetaDataModel';
import { IFieldValue } from '../../field/model/FieldModel';
import { IHiddenFieldValue } from '../HiddenFields';

export interface IUserValues {
  [key: string]: IFieldValue;
}

export interface IFormData {
  readonly [key: string]: IFieldValue | IHiddenFieldValue;
}

export interface ISubmissionData {
  readonly buttonId: string | undefined;
  readonly formData: IFormData;
  readonly metaData: IMetaDataModel;
}
