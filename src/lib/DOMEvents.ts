import { ISDK, IArenguForm } from '../sdk';
import { IFormModel } from '../form/model/FormModel';
import { IMetaDataModel } from '../form/model/MetaDataModel';
import { FieldError } from '../error/InvalidFields';
import { IFieldValue } from '../field/model/FieldModel';
import { IFormData } from '../form/model/SubmissionModel';
import { IConfirmationModel } from '../form/model/ConfirmationModel';

export enum EventNames {
  SDKInit = 'af-init',
  GetForm = 'af-getForm',
  GetFormError = 'af-getForm-error',
  GetFormSuccess = 'af-getForm-success',
  EmbedForm = 'af-embedForm',
  EmbedFormError = 'af-embedForm-error',
  EmbedFormSuccess = 'af-embedForm-success',
  PreviousStep = 'af-previousStep',
  NextStep = 'af-nextStep',
  SubmitForm = 'af-submitForm',
  SubmitFormError = 'af-submitForm-error',
  SubmitFormSuccess = 'af-submitForm-success',
  InvalidFieldsError = 'af-invalidFields-error',
  BlurField = 'af-blurField',
  FocusField = 'af-focusField',
  ChangeField = 'af-changeField',
}

export type IEvent = object;

export interface ISDKInitEvent extends IEvent {
  readonly sdk: ISDK;
}

export interface IGetFormEvent extends IEvent {
  readonly formId: string;
}

export interface IGetFormErrorEvent extends IEvent {
  readonly formId: string;
  readonly error: Error;
}

export interface IGetFormSuccessEvent extends IEvent {
  readonly formId: string;
  readonly data: IFormModel; // legacy
}

export interface IEmbedFormEvent extends IEvent {
  readonly formId: string;
  readonly selector?: string; // legacy
}

export interface IEmbedFormErrorEvent extends IEmbedFormEvent {
  readonly error: Error;
}

export interface IEmbedFormSuccessEvent extends IEmbedFormEvent {
  readonly parent: Element; // legacy
  readonly node: Element; // legacy
  readonly helper: IArenguForm;
}

export interface IPreviousStepEvent extends IEvent {
  readonly formId: string;
  readonly previous: string;
  readonly current: string;
}

export interface INextStepEvent extends IEvent {
  readonly formId: string;
  readonly current: string;
  readonly next: string;
}

export interface ISubmitFormEvent extends IEvent {
  readonly formId: string;
  readonly formData: IFormData;
  readonly metaData: IMetaDataModel;
}

export interface ISubmitFormErrorEvent extends ISubmitFormEvent {
  readonly error: Error;
}

export interface ISubmitFormSuccessEvent extends ISubmitFormEvent {
  readonly confirmation: IConfirmationModel;
}

export interface IInvalidFieldsErrorEvent extends ISubmitFormEvent {
  readonly fields: FieldError[];
}

export interface IFieldEvent extends IEvent {
  readonly fieldId: string;
  readonly value: IFieldValue;
}

export type IFieldFocusEvent = IFieldEvent;
export type IFieldBlurEvent = IFieldEvent;
export type IFieldChangeEvent = IFieldEvent;

interface IEventMap extends Record<EventNames, IEvent> {
  [EventNames.SDKInit]: ISDKInitEvent;
  [EventNames.GetForm]: IGetFormEvent;
  [EventNames.GetFormError]: IGetFormErrorEvent;
  [EventNames.GetFormSuccess]: IGetFormSuccessEvent;
  [EventNames.EmbedForm]: IEmbedFormEvent;
  [EventNames.EmbedFormError]: IEmbedFormErrorEvent;
  [EventNames.EmbedFormSuccess]: IEmbedFormSuccessEvent;
  [EventNames.PreviousStep]: IPreviousStepEvent;
  [EventNames.NextStep]: INextStepEvent;
  [EventNames.SubmitForm]: ISubmitFormEvent;
  [EventNames.SubmitFormError]: ISubmitFormErrorEvent;
  [EventNames.SubmitFormSuccess]: ISubmitFormSuccessEvent;
  [EventNames.InvalidFieldsError]: IInvalidFieldsErrorEvent;
  [EventNames.BlurField]: IFieldBlurEvent;
  [EventNames.FocusField]: IFieldFocusEvent;
  [EventNames.ChangeField]: IFieldChangeEvent;
}

export const DOMEvents = {
  emit<K extends keyof IEventMap>(name: K, data: IEventMap[K]): void {
    const event = new CustomEvent(name, { detail: data });
    document.dispatchEvent(event);
  },
};
