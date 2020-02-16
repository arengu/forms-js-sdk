import isNil from 'lodash/isNil';
import find from 'lodash/find';

import { HiddenFields } from '../HiddenFields'; // eslint-disable-line no-unused-vars

import { IFormModel } from '../model/FormModel';

import { Messages } from '../../lib/Messages';

import { IPresenter } from '../../base/Presenter';
import { IFormView, FormView, IFormViewListener } from '../view/FormView';
import { ISubmissionModel, IFormData, IUserValues } from '../model/SubmissionModel';
import { FormRepository } from '../../repository/FormRepository';
import { IConfirmationModel } from '../model/ConfirmationModel';
import { ThankYouView } from '../view/ThankYouView';
import { InvalidFields } from '../../error/InvalidFields';
import { MetaDataModelFactory } from '../model/MetaDataModel';
import { EventsFactory } from '../../lib/EventsFactory';
import { IValidationModel } from '../model/ValidationModel';
import { InvalidStep } from '../../error/InvalidStep';
import { IStepPresenter, IStepListener, StepPresenter } from '../../step/presenter/StepPresenter';
import { NavigationHistory } from '../../lib/NavigationHistory';

export abstract class FormPresenterHelper {
  public static getUserValues(stepP: IStepPresenter): Promise<IUserValues> {
    return stepP.getUserValues();
  }

  public static reset(presenter: IStepPresenter): void {
    return presenter.reset();
  }
}

export interface IFormPresenter extends IPresenter<IFormView> {
  getFormId(): string;
  setHiddenField(fieldId: string, value: string): void;
  render(): HTMLElement;
}

export class FormPresenter implements IFormPresenter, IFormViewListener, IStepListener {
  protected readonly formM: IFormModel;

  protected readonly formV: IFormView;

  protected readonly messages: Messages;

  protected readonly confV: ThankYouView;

  protected readonly stepsP: IStepPresenter[];

  protected readonly hiddenFields: HiddenFields;

  protected readonly signatures: Map<string, string>;

  protected currentStep?: IStepPresenter;

  protected history: NavigationHistory;

  protected constructor(formM: IFormModel, hiddenFields: HiddenFields, messages: Messages) {
    const { steps } = formM;
    this.formM = formM;
    this.formV = FormView.create(formM, this);
    this.messages = messages;
    this.confV = ThankYouView.create();
    this.stepsP = steps.map((sM): IStepPresenter => StepPresenter.create(sM, this, this.messages));
    this.hiddenFields = hiddenFields;
    this.signatures = new Map();
    this.currentStep = undefined;
    this.history = NavigationHistory.create();
  }

  public static create(model: IFormModel, hiddenFields: HiddenFields,
    messages: Messages): IFormPresenter {
    return new this(model, hiddenFields, messages);
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

    const proms = steps.map(FormPresenterHelper.getUserValues);
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

  public onGoBack(): void {
    this.goBack();
  }

  public onSubmitForm(): void {
    this.handleGoToNext(this.getCurrentStep());
  }

  public async handleGoToNext(stepP: IStepPresenter): Promise<void> {
    try {
      stepP.startAsync();

      const { valid } = await stepP.validateFields();

      if (!valid) {
        return;
      }

      await this.validateStep(stepP);

      if (this.isLastStep()) {
        await this.submitForm();
      } else {
        await this.goToNextStep();
      }
    } catch (err) {
      stepP.handleAnyError(err);
    } finally {
      stepP.endAsync();
    }
  }

  public handleValidation(stepId: string, res: IValidationModel): void {
    FormView.setCookies(res.cookies);
    this.signatures.set(stepId, res.signature);
  }

  public handleSubmission(conf: IConfirmationModel): void {
    const { message } = conf;

    this.reset();

    if (message) {
      this.goToThankYou(message);
    }

    if (conf.cookies.length) {
      FormView.setCookies(conf.cookies);
    }

    if (conf.target) {
      FormView.redirect({ target: conf.target, delay: conf.delay });
    }
  }

  public setContent(stepP: IStepPresenter, { scrollTop = true } = {}): void {
    this.currentStep = stepP;

    this.formV.setContent(stepP.getView());

    if (scrollTop) {
      this.formV.scrollTopIfNeeded();
    }
  }

  public goToFirstStep(): void {
    const firstStep = this.stepsP[0];

    if (isNil(firstStep)) {
      return;
    }

    this.setContent(firstStep);
  }

  public goBack(): void {
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

  public async goToNextStep(): Promise<void> {
    const nextStep = this.getNextStep();

    if (isNil(nextStep)) {
      return;
    }

    await this.goToStep(nextStep);
  }

  public async goToStep(nextStep: IStepPresenter): Promise<void> {
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

  public goToThankYou(msg: string): void {
    this.confV.setMessage(msg);

    this.currentStep = undefined;
    this.formV.setContent(this.confV);

    this.formV.scrollTopIfNeeded();
  }

  public reset(): void {
    this.stepsP.forEach(FormPresenterHelper.reset);
    this.history.clearHistory();
    this.goToFirstStep();
  }

  public async submitForm(): Promise<void> {
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
      const conf = await FormRepository.createSubmission(formId, submission, signature);
      this.handleSubmission(conf);
      EventsFactory.submitFormSuccess({ ...eventData, confirmation: conf });
    } catch (err) {
      if (err instanceof InvalidFields) {
        console.error('Some values are not valid:', err.fields);
        EventsFactory.invalidFieldsError({ ...eventData, fields: err.fields });
      } else {
        if (err instanceof InvalidStep) {
          FormView.setCookies(err.cookies);
        }
        console.error('Error sending submission:', err);
        EventsFactory.submitFormError({ ...eventData, error: err });
      }
      throw err;
    }
  }

  public async validateStep(stepP: IStepPresenter): Promise<void> {
    if (!stepP.hasStepValidation()) {
      return;
    }

    const formId = this.formM.id;

    const userValues = await this.getFormValues();

    const stepId = stepP.getStepId();
    const signature = this.getValidationSignature();

    try {
      const res = await FormRepository.validateStep(formId, stepId, userValues, signature);
      this.handleValidation(stepId, res);
    } catch (err) {
      if (err instanceof InvalidStep) {
        FormView.setCookies(err.cookies);
      }
      throw err;
    }
  }

  public render(): HTMLElement {
    const element = this.formV.render();

    this.goToFirstStep();

    return element;
  }
}
