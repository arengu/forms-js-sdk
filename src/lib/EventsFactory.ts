import { SDK } from '../sdk';
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
  readonly sdk: SDK;
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

export class EventsFactory {
  public static triggerEvent(name: EventNames, data: IEvent): void {
    const event = new CustomEvent(name, { detail: data });
    document.dispatchEvent(event);
  }

  public static sdkInit(details: ISDKInitEvent): void {
    this.triggerEvent(EventNames.SDKInit, details);
  }

  public static getForm(details: IGetFormEvent): void {
    this.triggerEvent(EventNames.GetForm, details);
  }

  public static getFormError(details: IGetFormErrorEvent): void {
    this.triggerEvent(EventNames.GetFormError, details);
  }

  public static getFormSuccess(details: IGetFormSuccessEvent): void {
    this.triggerEvent(EventNames.GetFormSuccess, details);
  }

  public static embedForm(details: IEmbedFormEvent): void {
    this.triggerEvent(EventNames.EmbedForm, details);
  }

  public static embedFormError(details: IEmbedFormErrorEvent): void {
    this.triggerEvent(EventNames.EmbedFormError, details);
  }

  public static embedFormSuccess(details: IEmbedFormSuccessEvent): void {
    this.triggerEvent(EventNames.EmbedFormSuccess, details);
  }

  public static previousStep(details: IPreviousStepEvent): void {
    this.triggerEvent(EventNames.PreviousStep, details);
  }

  public static nextStep(details: INextStepEvent): void {
    this.triggerEvent(EventNames.NextStep, details);
  }

  public static submitForm(details: ISubmitFormEvent): void {
    this.triggerEvent(EventNames.SubmitForm, details);
  }

  public static submitFormError(details: ISubmitFormErrorEvent): void {
    this.triggerEvent(EventNames.SubmitFormError, details);
  }

  public static submitFormSuccess(details: ISubmitFormSuccessEvent): void {
    this.triggerEvent(EventNames.SubmitFormSuccess, details);
  }

  public static invalidFieldsError(details: IInvalidFieldsErrorEvent): void {
    this.triggerEvent(EventNames.InvalidFieldsError, details);
  }

  public static onBlurField(details: IFieldBlurEvent): void {
    this.triggerEvent(EventNames.BlurField, details);
  }

  public static onChangeField(details: IFieldChangeEvent): void {
    this.triggerEvent(EventNames.ChangeField, details);
  }

  public static onFocusField(details: IFieldFocusEvent): void {
    this.triggerEvent(EventNames.FocusField, details);
  }
}
