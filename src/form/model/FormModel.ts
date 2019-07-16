import { IStepModel } from '../../step/model/StepModel';
import { IHiddenFieldDef } from '../HiddenFields';
import { IMessages } from '../../lib/Messages';

export interface IFormModel {
  readonly id: string;
  readonly hiddenFields: IHiddenFieldDef[];
  readonly messages: IMessages;
  readonly steps: IStepModel[];
}
