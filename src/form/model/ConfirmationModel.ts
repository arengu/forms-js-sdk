export interface IConfirmationModel {
  readonly id?: string;
  readonly message?: string;
  readonly data: object;
  readonly cookies: string[];
  readonly delay?: number;
  readonly target?: string;
}
