
import { IComponentModel } from '../../component/ComponentModel';

export interface IStepModel {
  readonly id: string;
  readonly name: string;
  readonly components: IComponentModel[];
  readonly onNext: boolean;
}
