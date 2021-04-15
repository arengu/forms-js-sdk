import { IFormStyle } from './FormStyle';
import { IStepModel } from '../../step/model/StepModel';
import { IHiddenFieldsDef } from '../HiddenFields';
import { IMessages } from '../../lib/Messages';
import { IFormData } from './SubmissionModel';

export enum SocialProvider {
  FACEBOOK = 'FACEBOOK',
  GOOGLE = 'GOOGLE',
}

interface IBaseSocialConfig {
  provider: SocialProvider;
  clientId: string;
  scopes: string[];
  text: string;
}

export interface IFacebookSocialConfig extends IBaseSocialConfig {
  provider: SocialProvider.FACEBOOK;
}

export interface IGoogleSocialConfig extends IBaseSocialConfig {
  provider: SocialProvider.GOOGLE;
}

export type ISocialProviderConfig = IFacebookSocialConfig | IGoogleSocialConfig;

export interface IFormModel {
  readonly id: string;
  readonly hiddenFields: IHiddenFieldsDef;
  readonly messages: IMessages;
  readonly steps: IStepModel[];
  readonly social: ISocialProviderConfig[];
  readonly style: IFormStyle;
  readonly branding?: boolean;
}

export interface IRefScope {
  /** @deprecated fields is the new recommended namespace */
  readonly field: IFormData;
  readonly fields: IFormData;
  /** @deprecated old references without namespace are not recommended anymore */
  readonly [key: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}
