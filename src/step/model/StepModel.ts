import { IFieldModel } from '../../field/model/FieldModel';

export interface IStepButtonsModel {
  readonly previous: null | string;
  readonly next: string;
}

export interface IStepModel {
  readonly id: string;
  readonly name: string;
  readonly components: IFieldModel[];
  readonly buttons: IStepButtonsModel;
  readonly onNext: boolean;
}
