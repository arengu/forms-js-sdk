import { ICookieModel } from './CookieModel';

export interface IValidationModel {
  readonly message?: string;
  readonly data: object;
  readonly cookies: ICookieModel[];
  readonly signature: string;
}
