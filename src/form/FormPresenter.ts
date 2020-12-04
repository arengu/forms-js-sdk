import find from 'lodash/find';
import isNil from 'lodash/isNil';

import { HiddenFields, IHiddenFieldValues } from './HiddenFields';

import { IFormModel, ISocialProviderConfig } from './model/FormModel';
import { IFormStyle, IExtendedFormStyle } from './model/FormStyle';

import { Messages } from '../lib/Messages';

import { IFormView, FormView, IFormViewListener } from './view/FormView';
import { ISubmissionData, IFormData, IUserValues } from './model/SubmissionModel';
import { FormRepository, IValidateStepParams, ISubmitFormParams } from '../repository/FormRepository';
import { ThankYouView } from './view/ThankYouView';
import { InvalidFields } from '../error/InvalidFields';
import { MetaDataModelFactory } from './model/MetaDataModel';
import { DOMEvents, EventNames } from '../lib/DOMEvents';
import { IStepPresenter, IStepPresenterListener, StepPresenter } from '../step/StepPresenter';
import { NavigationHistory } from '../lib/NavigationHistory';
import { ISocialFieldPresenter } from '../field/presenter/presenter/SocialFieldPresenter';
import { IFormInteractionResponse, EffectType, IFormInteractionRequest } from './FormInteraction';
import { IPresenter } from '../core/BaseTypes';
import { StyleHelper } from './view/StyleHelper';
import { IForwardButtonPresenter } from '../block/navigation/forward/ForwardButton';

export const FormPresenterHelper = {
  getUserValues(stepP: IStepPresenter): Promise<IUserValues> {
    return stepP.getUserValues();
  },

  reset(presenter: IStepPresenter): void {
    return presenter.reset();
  },
};

export interface IFormPresenter extends IPresenter {
  getFormId(): string;
  setHiddenField(fieldId: string, value: string): void;
  render(): HTMLElement;
  updateStyle(style: IFormStyle): void;
}

interface IComponentWithLoader {
  showLoading(): void;
  hideLoading(): void;
}

export interface IFormDeps {
  style: IExtendedFormStyle;
  social: ISocialProviderConfig[];
  messages: Messages;
}

export class FormPresenter implements IFormPresenter, IFormViewListener, IStepPresenterListener {
  protected readonly formM: IFormModel;
  protected readonly hiddenFields: HiddenFields;

  protected readonly formV: IFormView;
  protected readonly style: IExtendedFormStyle;

  protected currentStep?: IStepPresenter;
  protected readonly stepsP: IStepPresenter[];

  protected readonly confV: ThankYouView;

  protected readonly history: NavigationHistory;
  protected readonly signatures: Map<string, string>;

  protected constructor(formM: IFormModel) {
    this.formM = formM;
    this.hiddenFields = HiddenFields.create(formM.hiddenFields);

    this.style = StyleHelper.extendStyle(formM.style);

    const formD: IFormDeps = {
      style: this.style,
      social: formM.social,
      messages: Messages.create(formM.messages),
    };

    this.formV = FormView.create(formM, this);

    this.currentStep = undefined;
    this.stepsP = formM.steps.map((sM): IStepPresenter => StepPresenter.create(sM, formD, this));

    this.confV = ThankYouView.create();

    this.history = NavigationHistory.create();
    this.signatures = new Map();
  }

  public static create(model: IFormModel): IFormPresenter {
    return new this(model);
  }

  public getFormId(): string {
    return this.formM.id;
  }

  public getCurrentStep(): IStepPresenter {
    if (!this.currentStep) {
      throw new Error('No current step');
    }

    return this.currentStep;
  }

  public getNextStep(): IStepPresenter | undefined {
    const currStep = this.getCurrentStep();

    const indexCurrStep = this.stepsP.indexOf(currStep);

    const nextStep = this.stepsP[indexCurrStep + 1];

    return nextStep;
  }

  public async getUserValues(): Promise<IFormData> {
    const currStep = this.getCurrentStep();

    const steps = this.history.getSequence().concat(currStep);

    const proms = steps.map((sP) => FormPresenterHelper.getUserValues(sP));
    const userValuesPerStep = await Promise.all(proms);

    const userValues = Object.assign({}, ...userValuesPerStep);

    return userValues;
  }

  public getHiddenFields(): IHiddenFieldValues {
    return this.hiddenFields.getAll();
  }

  public setHiddenField(fieldId: string, value: string): void {
    this.hiddenFields.setValue(fieldId, value);
  }

  /**
   * Returns the data provided by the user plus the hidden fields
   */
  public async getFormValues(): Promise<IFormData> {
    const userValues = await this.getUserValues();
    const hiddenFields = this.getHiddenFields();

    const formValues = { ...userValues, ...hiddenFields };

    return formValues;
  }

  /**
   * Returns the final data we have to send to the server on form submission
   */
  public async getSubmissionData(buttonId: string | undefined): Promise<ISubmissionData> {
    return {
      formData: await this.getFormValues(),
      metaData: MetaDataModelFactory.create(buttonId),
    };
  }

  public getValidationSignature(): string | undefined {
    const steps = this.history.getHistory();

    for (let i = 0; i < steps.length; i += 1) {
      const stepId = steps[i].getStepId();
      const signature = this.signatures.get(stepId);

      if (signature) {
        return signature;
      }
    }

    return undefined;
  }

  public getSubmissionSignature(): string | undefined {
    const currStep = this.getCurrentStep();

    const signature = this.signatures.get(currStep.getStepId());

    if (signature) {
      return signature;
    }

    return this.getValidationSignature();
  }

  /**
   * Returns true when the user is not in the last step
   */
  public isLastStep(): boolean {
    const currStep = this.getCurrentStep();

    const indexCurrStep = this.stepsP.indexOf(currStep);

    return (indexCurrStep + 1) === this.stepsP.length;
  }

  public getView(): IFormView {
    return this.formV;
  }

  public onGotoPreviousStep(): void {
    this.gotoPreviousStep();
  }

  public async onSocialLogin(compP: ISocialFieldPresenter, stepP: IStepPresenter): Promise<void> {
    await this.goForward(compP.getFieldId(), compP, stepP);
  }

  public onSubmitForm(): void {
    this.getCurrentStep().fireNextStep();
  }

  public onGoForward(buttonP: IForwardButtonPresenter, stepP: IStepPresenter): void {
    this.goForward(buttonP.getId(), buttonP, stepP);
  }

  public async goForward(buttonId: string | undefined, compP: IComponentWithLoader, stepP: IStepPresenter): Promise<void> {
    try {
      compP.showLoading();
      stepP.blockComponents();

      const stepVal = await stepP.validateFields();

      if (!stepVal.valid) {
        return;
      }

      const flowRes = await this.executeFlow(buttonId, stepP);

      if (flowRes) {
        return;
      }

      if (this.isLastStep()) {
        await this.submitForm(buttonId, stepP);
      } else {
        await this.gotoNextStep();
      }
    } catch (err) {
      stepP.handleAnyError(err);
    } finally {
      stepP.unblockComponents();
      compP.hideLoading();
    }
  }

  public async handleFormInteraction(req: IFormInteractionRequest, res: IFormInteractionResponse): Promise<void> {
    const currStep = this.getCurrentStep();

    FormView.setCookies(res.cookies);

    const { effect } = res;

    if (effect.type === EffectType.ERROR_MESSAGE) {
      DOMEvents.emit(
        EventNames.FormEffectErrorMessage,
        {
          formId: req.formId,
          stepId: req.stepId,
          message: effect.message,
        },
      );
      currStep.setStepError(effect.message);
      return;
    }

    if (effect.type === EffectType.THANK_YOU) {
      DOMEvents.emit(
        EventNames.FormEffectThankYou,
        {
          formId: req.formId,
          stepId: req.stepId,
        },
      );
      DOMEvents.emit(
        EventNames.SubmitFormSuccess,
        {
          formId: req.formId,
          formData: req.formData,
          metaData: req.metaData,
          confirmation: {
            id: effect.submissionId,
            message: effect.message,
            data: res.data,
            cookies: res.cookies,
            ...effect.redirect,
          },
        },
      );

      if (effect.message) {
        this.gotoThankYou(effect.message);
      }

      if (effect.redirect) {
        FormView.redirect(effect.redirect);
      }

      return;
    }

    if (effect.type === EffectType.NEXT_STEP) {
      this.signatures.set(currStep.getStepId(), effect.signature);

      if (this.isLastStep()) {
        await this.submitForm(req.metaData.trigger.buttonId, currStep);
      } else {
        await this.gotoNextStep();
      }

      return;
    }

    if (effect.type === EffectType.JUMP_TO_STEP) {
      this.signatures.set(currStep.getStepId(), effect.signature);

      const nextStep = find(this.stepsP, (sP) => sP.getStepId() === effect.stepId);
      if (nextStep) {
        this.jumpToStep(nextStep);
      }

      return;
    }
  }

  public setContent(newStep: IStepPresenter): void {
    const oldStep = this.currentStep;

    newStep.onShow();

    this.currentStep = newStep;

    this.formV.setContent(newStep.render());

    if (oldStep) {
      oldStep.onHide();
      this.formV.scrollTopIfNeeded(); // do not scroll on first content
    }
  }

  public gotoFirstStep(): void {
    const firstStep = this.stepsP[0];

    if (isNil(firstStep)) {
      return;
    }

    if (firstStep.isDynamic()) {
      const hiddenFields = this.getHiddenFields(); // no user values on first step
      firstStep.updateStep(hiddenFields);
    }

    this.setContent(firstStep);
  }

  public gotoPreviousStep(): void {
    const currStep = this.getCurrentStep();
    const prevStep = this.history.popStep();

    if (isNil(currStep) || isNil(prevStep)) {
      return;
    }

    currStep.clearAllErrors();

    this.setContent(prevStep);

    DOMEvents.emit(EventNames.PreviousStep, {
      formId: this.formM.id,
      current: currStep.getStepId(),
      previous: prevStep.getStepId(),
    });
  }

  public async gotoNextStep(): Promise<void> {
    const nextStep = this.getNextStep();

    if (isNil(nextStep)) {
      return;
    }

    await this.jumpToStep(nextStep);
  }

  public async jumpToStep(nextStep: IStepPresenter): Promise<void> {
    const currStep = this.getCurrentStep();

    this.history.pushStep(currStep);

    if (nextStep.isDynamic()) {
      const formValues = await this.getFormValues();
      nextStep.updateStep(formValues);
    }

    this.setContent(nextStep);

    DOMEvents.emit(EventNames.NextStep, {
      formId: this.formM.id,
      current: currStep.getStepId(),
      next: nextStep.getStepId(),
    });
  }

  public gotoThankYou(msg: string): void {
    this.confV.setMessage(msg);

    const oldStep = this.currentStep;

    if (oldStep && oldStep.onHide) {
      oldStep?.onHide();
    }

    this.currentStep = undefined;
    this.formV.setContent(this.confV.render());

    this.formV.scrollTopIfNeeded();
  }

  public reset(): void {
    this.stepsP.forEach((sP) => FormPresenterHelper.reset(sP));
    this.history.clearHistory();
    this.gotoFirstStep();
  }

  public async submitForm(buttonId: string | undefined, currStep: IStepPresenter): Promise<void> {
    const formId = this.getFormId();
    const stepId = currStep.getStepId();
    const submission = await this.getSubmissionData(buttonId);
    const signature = this.getSubmissionSignature();

    const eventData = {
      formId,
      formData: submission.formData,
      metaData: submission.metaData,
    };

    const interReq: IFormInteractionRequest = {
      formId,
      stepId,
      ...submission,
    };

    const repoParams: ISubmitFormParams = {
      formId,
      data: submission,
      signature,
    };

    try {
      DOMEvents.emit(EventNames.SubmitForm, eventData);
      const interRes = await FormRepository.submitForm(repoParams);
      await this.handleFormInteraction(interReq, interRes);
    } catch (err) {
      if (err instanceof InvalidFields) {
        console.error('Some values are not valid:', err.fields);
        DOMEvents.emit(EventNames.InvalidFieldsError, { ...eventData, fields: err.fields });
      } else {
        console.error('Error sending submission:', err);
        DOMEvents.emit(EventNames.SubmitFormError, { ...eventData, error: err });
      }
      throw err;
    }
  }

  public async executeFlow(buttonId: string | undefined, currStep: IStepPresenter): Promise<IFormInteractionResponse | undefined> {
    if (!currStep.hasFlow()) {
      return;
    }

    const formId = this.getFormId();
    const stepId = currStep.getStepId();
    const submission = await this.getSubmissionData(buttonId);
    const signature = this.getValidationSignature();

    const interReq: IFormInteractionRequest = {
      formId,
      stepId,
      ...submission,
    };

    const repoParams: IValidateStepParams = {
      formId,
      stepId,
      data: submission,
      signature,
    }

    const interRes = await FormRepository.validateStep(repoParams);

    await this.handleFormInteraction(interReq, interRes);

    return interRes;
  }

  public render(): HTMLElement {
    const element = this.formV.render();

    this.formV.setStyle(this.style);

    this.gotoFirstStep();

    return element;
  }

  public updateStyle(style: IFormStyle): void {
    const extendedStyle = StyleHelper.extendStyle(style);

    this.formV.setStyle(extendedStyle);
    this.stepsP.forEach((stepP) => stepP.onUpdateStyle(extendedStyle));
  }
}
