import { ICookieModel } from './CookieModel';

export interface IConfirmationModel {
  readonly id: string;
  readonly message?: string;
  readonly data: object;
  readonly cookies: ICookieModel[];
  readonly delay?: number;
  readonly target?: string;
}
