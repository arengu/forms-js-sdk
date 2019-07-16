import { ICookieModel } from '../form/model/CookieModel';
import { IArenguError, ArenguError } from './ArenguError';

export interface IInvalidStep extends IArenguError {
  readonly data: object;
  readonly cookies: ICookieModel[];
}

export class InvalidStep extends ArenguError implements IInvalidStep {
  public readonly data: object;

  public readonly cookies: ICookieModel[];;

  protected constructor(def: IInvalidStep) {
    super(def.code, def.message, def.details);
    this.data = def.data || {};
    this.cookies = def.cookies || {};
  }

  public static create(def: IInvalidStep): InvalidStep {
    return new this(def);
  }
}
