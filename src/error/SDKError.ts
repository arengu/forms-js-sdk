import { SDKErrorCode } from './ErrorCodes';
import { ArenguError, IErrorDetails } from './ArenguError';

export class SDKError extends ArenguError {
  public static create(code: SDKErrorCode, message: string, details?: IErrorDetails): SDKError {
    return new this(code, message, details);
  }
}
