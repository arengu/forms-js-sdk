import { ICookieModel } from './model/CookieModel';

export enum ActionType {
  NEXT_STEP = 'NEXT_STEP',
  JUMP_TO_STEP = 'JUMP_TO_STEP',
  THANK_YOU = 'THANK_YOU',
  ERROR_MESSAGE = 'ERROR_MESSAGE',
}

export interface IPageRedirection {
  target: string;
  delay?: number;
}

export interface INextStepAction {
  type: ActionType.NEXT_STEP;
}

export interface IJumpToStepAction {
  type: ActionType.JUMP_TO_STEP;
  stepId: string;
}

export interface IThankYouAction {
  type: ActionType.THANK_YOU;
  submissionId?: string;
  message?: string;
  redirection?: IPageRedirection;
}

export interface IErrorMessageAction {
  type: ActionType.ERROR_MESSAGE;
  message: string;
}

interface IBaseFormInteraction {
  readonly result: string;
  readonly action: object;
  readonly data: object;
  readonly cookies: ICookieModel[];
}

export enum FormInteractionResult {
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
}

export interface IFailedFormInteraction extends IBaseFormInteraction {
  readonly result: FormInteractionResult.FAILURE;
  readonly action: IErrorMessageAction;
}

export interface ISuccessfulFormInteraction extends IBaseFormInteraction {
  readonly result: FormInteractionResult.SUCCESS;
  readonly action: INextStepAction | IJumpToStepAction | IThankYouAction;
  readonly signature: string;
}

export type IFormInteraction = ISuccessfulFormInteraction | IFailedFormInteraction;
