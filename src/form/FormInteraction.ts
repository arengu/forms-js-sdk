import { ICookieModel } from './model/CookieModel';
import { IFormData } from './model/SubmissionModel';
import { IMetaDataModel } from './model/MetaDataModel';

export enum EffectType {
  NEXT_STEP = 'NEXT_STEP',
  JUMP_TO_STEP = 'JUMP_TO_STEP',
  THANK_YOU = 'THANK_YOU',
  ERROR_MESSAGE = 'ERROR_MESSAGE',
}

export interface IPageRedirection {
  readonly target: string;
  readonly delay?: number;
}

export interface INextStepAction {
  readonly type: EffectType.NEXT_STEP;
  readonly signature: string;
}

export interface IJumpToStepAction {
  readonly type: EffectType.JUMP_TO_STEP;
  readonly stepId: string;
  readonly signature: string;
}

export interface IThankYouAction {
  readonly type: EffectType.THANK_YOU;
  readonly submissionId?: string;
  readonly message?: string;
  readonly redirect?: IPageRedirection;
}

export interface IErrorMessageAction {
  readonly type: EffectType.ERROR_MESSAGE;
  readonly message: string;
}

export interface IFormInteractionResponse {
  readonly effect: INextStepAction | IJumpToStepAction | IThankYouAction | IErrorMessageAction;
  readonly data: object;
  readonly cookies: ICookieModel[];
}

export interface IFormInteractionRequest {
  readonly formId: string;
  readonly stepId: string;
  readonly formData: IFormData;
  readonly metaData: IMetaDataModel;
}
