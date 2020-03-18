export interface IValueHandler<FVA> {
  getValue(): FVA | Promise<FVA>;
  setValue(value: FVA): void;
}
