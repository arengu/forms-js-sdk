import { ArenguError, IArenguError } from './ArenguError';

export type IAppError = IArenguError;

export class AppError extends ArenguError {
  public static create(data: IAppError): AppError {
    return new this(data.code, data.message, data.details);
  }
}
