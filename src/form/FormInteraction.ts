import { IFormData } from './model/SubmissionModel';
import { IMetaDataModel } from './model/MetaDataModel';

export type IReplacements = Record<string, unknown>;

export enum EffectType {
  NEXT_STEP = 'NEXT_STEP',
  JUMP_TO_STEP = 'JUMP_TO_STEP',
  SUBMIT_FORM = 'SUBMIT_FORM',
  THANK_YOU = 'THANK_YOU',
  ERROR_MESSAGE = 'ERROR_MESSAGE',
  AUTHN_PAYMENT = 'AUTHN_PAYMENT',
}

export interface IPageRedirection {
  readonly target: string;
  readonly delay?: number;
}

export interface IEffectAuthenticatePayment {
  readonly type: EffectType.AUTHN_PAYMENT;
  readonly signature: string;
  readonly fieldId: string;
  readonly data: object;
}

export interface IEffectNextStep {
  readonly type: EffectType.NEXT_STEP;
  readonly signature: string;
  readonly replacements: IReplacements;
}

export interface IEffectSubmitForm {
  readonly type: EffectType.SUBMIT_FORM;
  readonly signature: string;
}

export interface IEffectJumpToStep {
  readonly type: EffectType.JUMP_TO_STEP;
  readonly stepId: string;
  readonly signature: string;
  readonly replacements: IReplacements;
}

export interface IEffectThankYou {
  readonly type: EffectType.THANK_YOU;
  readonly submissionId?: string;
  readonly message?: string;
  readonly redirect?: IPageRedirection;
}

export interface IEffectErrorMessage {
  readonly type: EffectType.ERROR_MESSAGE;
  readonly message: string;
}

export type IEffect = IEffectNextStep | IEffectJumpToStep | IEffectSubmitForm | IEffectThankYou | IEffectErrorMessage | IEffectAuthenticatePayment;

export interface IFormInteractionResponse {
  readonly effect: IEffect;
  readonly data: object;
  readonly cookies: string[];
}

export interface IFormInteractionRequest {
  readonly formId: string;
  readonly stepId: string;
  readonly buttonId: string | undefined;
  readonly formData: IFormData;
  readonly metaData: IMetaDataModel;
}
