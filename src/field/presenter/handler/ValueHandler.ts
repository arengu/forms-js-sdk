export interface ISyncValueHandler<FVA> {
  getValue(): FVA;
  setValue(value: FVA): void;
}

export interface IAsyncValueHandler<FVA> {
  getValue(): Promise<FVA>;
  setValue(value: FVA): Promise<void>;
}

export type IValueHandler<FVA> = ISyncValueHandler<FVA> | IAsyncValueHandler<FVA>;
