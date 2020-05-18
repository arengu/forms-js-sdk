export enum SameSitePolicy {
  STRICT = 'strict',
  LAX = 'lax'
}

export interface ICookieObjectModel {
  readonly name: string;
  readonly value: string;
  readonly path: string;
  readonly domain?: string;
  readonly maxAge: number;
  readonly secure: boolean;
  readonly sameSite: SameSitePolicy;
}

export type ICookieModel = ICookieObjectModel | string;
