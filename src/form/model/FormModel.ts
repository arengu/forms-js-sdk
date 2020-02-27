import { IStepModel } from '../../step/model/StepModel';
import { IHiddenFieldDef } from '../HiddenFields';
import { IMessages } from '../../lib/Messages';

export enum SocialProvider {
  FACEBOOK = 'FACEBOOK',
}

interface IBaseSocialConfig {
  provider: SocialProvider;
  clientId: string;
  scopes: string[];
  button: string;
}

export interface IFacebookSocialConfig extends IBaseSocialConfig {
  provider: SocialProvider.FACEBOOK;
}

export type ISocialConfig = IFacebookSocialConfig;

export interface IFormModel {
  readonly id: string;
  readonly hiddenFields: IHiddenFieldDef[];
  readonly messages: IMessages;
  readonly steps: IStepModel[];
  readonly social: ISocialConfig[];
}
