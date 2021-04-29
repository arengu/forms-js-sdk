import { IMagicResolver } from "../../../lib/MagicResolver";

export interface ISyncValueHandler<FVA> {
  getValue(): FVA;
  setDefaultValue(resolver: IMagicResolver): void;
  setValue(value: FVA): FVA;
}

export interface IAsyncValueHandler<FVA> {
  getValue(): Promise<FVA>;
  setValue(value: FVA): Promise<FVA>;
}

export type IValueHandler<FVA> = ISyncValueHandler<FVA> | IAsyncValueHandler<FVA>;
