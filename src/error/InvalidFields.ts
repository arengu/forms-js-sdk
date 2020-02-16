
import { DEFAULT_MESSAGES } from '../lib/Messages';
import { AppErrorCode, FieldErrorCode } from './ErrorCodes';
import { ArenguError, IArenguError, IErrorDetails } from './ArenguError';

export const DEFAULT_MESSAGE = DEFAULT_MESSAGES.ERR_INVALID_INPUT;

export const DEFAULT_CODE = AppErrorCode.INVALID_INPUT;

export const FIELD_PATH_PATTERN = '/formData/';

export interface IFieldError extends IArenguError {
  readonly fieldId: string;
}
export interface IPropertyError extends IArenguError {
  readonly path: string;
}

export class FieldErrorHelper {
  public static getFieldId(path: string): string {
    const tokens = path.split('/');
    const fieldId = tokens[2];
    return fieldId;
  }
}

export class FieldError extends ArenguError {
  public readonly fieldId: string;

  protected constructor(fieldId: string, code: string, message: string,
    details?: IErrorDetails) {
    super(code, message, details);
    this.fieldId = fieldId;
  }

  public static create(fieldId: string, code: FieldErrorCode, message: string,
    details?: IErrorDetails): FieldError {
    return new FieldError(fieldId, code, message, details);
  }

  public static fromPropertyError(propErr: IPropertyError): FieldError {
    const fieldId = FieldErrorHelper.getFieldId(propErr.path);
    return new this(fieldId, propErr.code, propErr.message, propErr.details);
  }
}

export interface ISchemaErrorDetails {
  readonly invalidProperties: IPropertyError[];
}

export interface ISchemaError {
  readonly code: string;
  readonly message: string;
  readonly details: ISchemaErrorDetails;
}

export interface IInvalidFieldsDetails {
  readonly invalidProperties: FieldError[];
}

export abstract class InvalidFieldsHelper {
  public static isFormField(err: IPropertyError): boolean {
    return err.path.startsWith(FIELD_PATH_PATTERN);
  }
}

export class InvalidFields extends ArenguError {
  public readonly details: IInvalidFieldsDetails;

  protected constructor(fields: FieldError[]) {
    const details: IInvalidFieldsDetails = { invalidProperties: fields };
    super(DEFAULT_CODE, DEFAULT_MESSAGE, details);
    this.details = details;
  }

  public static fromFieldErrors(fields: FieldError[]): InvalidFields {
    return new InvalidFields(fields);
  }

  public static fromSchemaError(schemaErr: ISchemaError): InvalidFields {
    const { invalidProperties } = schemaErr.details;

    const invalidFields = invalidProperties.filter((pE) => InvalidFieldsHelper.isFormField(pE));

    const fieldErrors = invalidFields.map((pE) => FieldError.fromPropertyError(pE));

    const parentError = InvalidFields.fromFieldErrors(fieldErrors);

    return parentError;
  }

  public get fields(): FieldError[] {
    return this.details.invalidProperties;
  }
}
