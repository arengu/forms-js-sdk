import { IStepModel } from '../../step/model/StepModel';
import { IHiddenFieldsDef } from '../HiddenFields';
import { IMessages } from '../../lib/Messages';

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

export type ISocialConfig = IFacebookSocialConfig | IGoogleSocialConfig;

export interface IFormModel {
  readonly id: string;
  readonly hiddenFields: IHiddenFieldsDef;
  readonly messages: IMessages;
  readonly steps: IStepModel[];
  readonly social: ISocialConfig[];
}
