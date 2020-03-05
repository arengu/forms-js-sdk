import find from 'lodash/find';
import isNil from 'lodash/isNil';

import { HiddenFields } from './HiddenFields'; // eslint-disable-line no-unused-vars

import { IFormModel, ISocialConfig } from './model/FormModel';

import { Messages } from '../lib/Messages';

import { IFormView, FormView, IFormViewListener } from './view/FormView';
import { ISubmissionModel, IFormData, IUserValues } from './model/SubmissionModel';
import { FormRepository } from '../repository/FormRepository';
import { ThankYouView } from './view/ThankYouView';
import { InvalidFields } from '../error/InvalidFields';
import { MetaDataModelFactory } from './model/MetaDataModel';
import { EventsFactory } from '../lib/EventsFactory';
import { IStepPresenter, IStepPresenterListener, StepPresenter } from '../step/StepPresenter';
import { NavigationHistory } from '../lib/NavigationHistory';
import { ISocialFieldPresenter } from '../field/presenter/presenter/SocialFieldPresenter';
import { IFormInteraction, FormInteractionResult, ActionType } from './FormInteraction';
import { IPresenter } from '../core/BaseTypes';

export abstract class FormPresenterHelper {
  public static getUserValues(stepP: IStepPresenter): Promise<IUserValues> {
    return stepP.getUserValues();
  }

  public static reset(presenter: IStepPresenter): void {
    return presenter.reset();
  }
}

export interface IFormPresenter extends IPresenter {
  getFormId(): string;
  setHiddenField(fieldId: string, value: string): void;
  render(): HTMLElement;
}

export interface IFormDeps {
  social: ISocialConfig[];
  messages: Messages;
}

export class FormPresenter implements IFormPresenter, IFormViewListener, IStepPresenterListener {
  protected readonly formM: IFormModel;
  protected readonly hiddenFields: HiddenFields;

  protected readonly formV: IFormView;

  protected currentStep?: IStepPresenter;
  protected readonly stepsP: IStepPresenter[];

  protected readonly confV: ThankYouView;

  protected readonly history: NavigationHistory;
  protected readonly signatures: Map<string, string>;

  protected constructor(formM: IFormModel, initValues?: Record<string, string>) {
    this.formM = formM;
    this.hiddenFields = HiddenFields.create(formM.hiddenFields, initValues);

    const formD: IFormDeps = {
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

  public static create(model: IFormModel, initValues?: Record<string, string>): IFormPresenter {
    return new this(model, initValues);
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

  public getHiddenFields(): object {
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
  public async getSubmissionData(): Promise<ISubmissionModel> {
    return {
      formData: await this.getFormValues(),
      metaData: MetaDataModelFactory.create(),
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

  public onSocialLogin(stepP: IStepPresenter, compP: ISocialFieldPresenter): void {
    try {
      compP.showLoading();
      this.onGotoNextStep(stepP);
    } finally {
      compP.hideLoading();
    }
  }

  public onSubmitForm(): void {
    const stepP = this.getCurrentStep();

    try {
      stepP.showLoading();
      this.onGotoNextStep(stepP);
    } finally {
      stepP.hideLoading();
    }
  }

  public async onGotoNextStep(stepP: IStepPresenter): Promise<void> {
    try {
      stepP.blockComponents();

      const stepVal = await stepP.validate();

      if (!stepVal.valid) {
        return;
      }

      const flowRes = await this.executeFlow(stepP);

      if (flowRes) {
        return;
      }

      if (this.isLastStep()) {
        await this.submitForm(stepP);
      } else {
        await this.gotoNextStep();
      }
    } catch (err) {
      stepP.handleAnyError(err);
    } finally {
      stepP.unblockComponents();
    }
  }

  public handleFormInteraction(currStep: IStepPresenter, res: IFormInteraction): void {
    FormView.setCookies(res.cookies);

    if (res.result === FormInteractionResult.SUCCESS) {
      this.signatures.set(currStep.getStepId(), res.signature);
    }

    const { action } = res;

    if (action.type === 'ERROR_MESSAGE') {
      currStep.setError(action.message);
      return;
    }

    if (action.type === 'NEXT_STEP') {
      this.gotoNextStep();
      return;
    }

    if (action.type === 'THANK_YOU') {
      if (action.message) {
        this.gotoThankYou(action.message);
      }
      if (action.redirection) {
        FormView.redirect(action.redirection);
      }
      return;
    }

    if (action.type === ActionType.JUMP_TO_STEP) {
      const nextStep = find(this.stepsP, (sP) => sP.getStepId() === action.stepId);
      if (nextStep) {
        this.jumpToStep(nextStep);
      }
    }
  }

  public setContent(newStep: IStepPresenter, { scrollTop = true } = {}): void {
    const oldStep = this.currentStep;

    newStep.onShow();

    this.currentStep = newStep;

    this.formV.setContent(newStep.render());

    if (oldStep && oldStep.onHide) {
      oldStep.onHide();
    }

    if (scrollTop) {
      this.formV.scrollTopIfNeeded();
    }
  }

  public gotoFirstStep(): void {
    const firstStep = this.stepsP[0];

    if (isNil(firstStep)) {
      return;
    }

    this.setContent(firstStep);
  }

  public gotoPreviousStep(): void {
    const currStep = this.getCurrentStep();
    const prevStep = this.history.popStep();

    if (isNil(currStep) || isNil(prevStep)) {
      return;
    }

    this.setContent(prevStep);

    EventsFactory.previousStep({
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

    this.setContent(nextStep, { scrollTop: true });

    EventsFactory.nextStep({
      formId: this.formM.id,
      current: currStep.getStepId(),
      next: nextStep.getStepId(),
    });
  }

  public gotoThankYou(msg: string): void {
    this.confV.setMessage(msg);

    const oldStep = this.currentStep;

    if (oldStep && oldStep.onHide) {
      oldStep.onHide();
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

  public async submitForm(currStep: IStepPresenter): Promise<void> {
    const formId = this.formM.id;
    const submission = await this.getSubmissionData();
    const signature = this.getSubmissionSignature();

    const eventData = {
      formId,
      formData: submission.formData,
      metaData: submission.metaData,
    };

    try {
      EventsFactory.submitForm(eventData);
      const res = await FormRepository.createSubmission(formId, submission, signature);
      this.handleFormInteraction(currStep, res);
      // TODO: support again af-submitForm-success event
      // EventsFactory.submitFormSuccess({ ...eventData, confirmation: conf });
    } catch (err) {
      if (err instanceof InvalidFields) {
        console.error('Some values are not valid:', err.fields);
        EventsFactory.invalidFieldsError({ ...eventData, fields: err.fields });
      } else {
        console.error('Error sending submission:', err);
        EventsFactory.submitFormError({ ...eventData, error: err });
      }
      throw err;
    }
  }

  public async executeFlow(stepP: IStepPresenter): Promise<IFormInteraction | undefined> {
    if (!stepP.hasFlow()) {
      return;
    }

    const formId = this.formM.id;

    const userValues = await this.getFormValues();

    const stepId = stepP.getStepId();
    const signature = this.getValidationSignature();

    const res = await FormRepository.executeFlow(formId, stepId, userValues, signature);

    this.handleFormInteraction(stepP, res);

    return res;
  }

  public render(): HTMLElement {
    const element = this.formV.render();

    this.gotoFirstStep();

    return element;
  }
}
