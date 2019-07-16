import { ICookieModel } from './CookieModel';

export interface IValidationModel {
  readonly message: null | string;
  readonly data: object;
  readonly cookies: ICookieModel[];
  readonly signature: string;
}
