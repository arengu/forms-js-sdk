import { ICookieModel } from './model/CookieModel';

export interface INextStepAction {
  action: 'NEXT_STEP';
}

export interface IGoToStepAction {
  action: 'GOTO_STEP';
  stepId: string;
}

export interface IThankYouAction {
  action: 'THANK_YOU';
  message?: string;
}

export interface IErrorMessageAction {
  action: 'ERROR_MESSAGE';
  message: string;
}

export interface IBaseFlowExecution {
  readonly action: object;
  readonly data: object;
  readonly cookies: ICookieModel[];
  readonly signature: string;
}

export interface IFailedFlowExecution extends IBaseFlowExecution {
  readonly action: IErrorMessageAction;
}

export interface ISuccessfulFlowExecution extends IBaseFlowExecution {
  readonly action: INextStepAction | IGoToStepAction | IThankYouAction;
  readonly signature: string;
}

export type IFlowExecution = ISuccessfulFlowExecution | IFailedFlowExecution;
