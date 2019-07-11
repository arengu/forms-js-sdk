export type IErrorDetails = Record<string,
  any>; // eslint-disable-line @typescript-eslint/no-explicit-any

export interface IArenguError {
  readonly code: string;
  readonly message: string;
  readonly details: IErrorDetails;
}
export abstract class ArenguError extends Error implements IArenguError {
  public readonly code: string;

  public readonly details: IErrorDetails;

  protected constructor(code: string, message: string, details?: IErrorDetails) {
    super(message);
    this.code = code;
    this.details = details || {};
  }
}
