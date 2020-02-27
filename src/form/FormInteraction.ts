import { ICookieModel } from './model/CookieModel';

export interface IPageRedirection {
  target: string;
  delay?: number;
}

export interface INextStepAction {
  type: 'NEXT_STEP';
}

export interface IGotoStepAction {
  type: 'GOTO_STEP';
  stepId: string;
}

export interface IThankYouAction {
  type: 'THANK_YOU';
  submissionId?: string;
  message?: string;
  redirection?: IPageRedirection;
}

export interface IErrorMessageAction {
  type: 'ERROR_MESSAGE';
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
  readonly action: INextStepAction | IGotoStepAction | IThankYouAction;
  readonly signature: string;
}

export type IFormInteraction = ISuccessfulFormInteraction | IFailedFormInteraction;
