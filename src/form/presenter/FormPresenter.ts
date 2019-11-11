import isNil from 'lodash/isNil';

import { HiddenFields } from '../HiddenFields'; // eslint-disable-line no-unused-vars

import { IFormModel } from '../model/FormModel';

import { SignatureStack } from '../../lib/SignatureStack';
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

  protected readonly signatures: SignatureStack;

  protected currentStep: number;

  protected constructor(formM: IFormModel, hiddenFields: HiddenFields, messages: Messages) {
    const { steps } = formM;
    this.formM = formM;
    this.formV = FormView.create(formM, this);
    this.messages = messages;
    this.confV = ThankYouView.create();
    this.stepsP = steps.map((sM): IStepPresenter => StepPresenter.create(sM, this, this.messages));
    this.hiddenFields = hiddenFields;
    this.signatures = SignatureStack.fromSteps(steps);
    this.currentStep = -1;
  }

  public static create(model: IFormModel, hiddenFields: HiddenFields,
    messages: Messages): IFormPresenter {
    return new this(model, hiddenFields, messages);
  }

  public getFormId(): string {
    return this.formM.id;
  }

  public getFirstStep(): IStepPresenter | undefined {
    return this.stepsP[0];
  }

  public getPreviousStep(): IStepPresenter | undefined {
    return this.stepsP[this.currentStep - 1];
  }

  public getCurrentStep(): IStepPresenter {
    return this.stepsP[this.currentStep];
  }

  public getNextStep(): IStepPresenter | undefined {
    return this.stepsP[this.currentStep + 1];
  }

  /**
   * @param stepIndex Index of the last step you want to get value from
   */
  public async getUserValues(stepIndex?: number): Promise<IFormData> {
    const steps = (!isNil(stepIndex))
      ? this.stepsP.slice(0, stepIndex + 1)
      : this.stepsP;
    const proms = steps.map(FormPresenterHelper.getUserValues);
    const userValuesPerStep = await Promise.all(proms);

    const userValues = Object.assign({}, ...userValuesPerStep);

    return userValues;
  }

  public getHiddenFields(): object {
    const hiddenFields = this.hiddenFields.getAll();
    return hiddenFields;
  }

  public setHiddenField(fieldId: string, value: string): void {
    this.hiddenFields.setValue(fieldId, value);
  }

  /**
   * Returns the data provided by the user plus the hidden fields
   * @param stepIndex Index of the last step you want to get value from
   */
  public async getFormValues(stepIndex?: number): Promise<IFormData> {
    const userValues = await this.getUserValues(stepIndex);
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

  /**
   * Returns true when the user is not in the first step
   */
  public isFirstStep(): boolean {
    return this.currentStep === 0;
  }

  /**
   * Returns true when the user is not in the last step
   */
  public isLastStep(): boolean {
    return (this.currentStep + 1) === this.stepsP.length;
  }

  public getView(): IFormView {
    return this.formV;
  }

  public onGoToPreviousStep(): void {
    if (!this.isFirstStep()) {
      this.showPreviousStep();
    }
  }

  public onSubmitForm(): void {
    const currStepP = this.getCurrentStep();
    this.handleGoToNext(currStepP);
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
        this.showNextStep();
      }
    } catch (err) {
      stepP.handleAnyError(err);
    } finally {
      stepP.endAsync();
    }
  }

  public handleValidation(stepId: string, res: IValidationModel): void {
    FormView.setCookies(res.cookies);
    this.signatures.setSignature(stepId, res.signature);
  }

  public handleSubmission(conf: IConfirmationModel): void {
    const { message } = conf;

    this.reset();

    if (message) {
      this.showThankYou(message);
    }

    if (conf.cookies.length) {
      FormView.setCookies(conf.cookies);
    }

    if (conf.target) {
      FormView.redirect({ target: conf.target, delay: conf.delay });
    }
  }

  public showThankYou(msg: string): void {
    this.currentStep = -1;
    this.confV.setMessage(msg);

    this.formV.showPage(this.confV);
    this.formV.scrollTopIfNeeded();
  }

  public showStep(stepP: IStepPresenter, scroll?: boolean): void {
    this.currentStep = this.stepsP.indexOf(stepP);
    this.formV.showPage(stepP.getView());

    if (scroll === true) {
      this.formV.scrollTopIfNeeded();
    }
  }

  public showPreviousStep(): void {
    const currStep = this.getCurrentStep();
    const prevStep = this.getPreviousStep();

    if (isNil(prevStep)) {
      throw new Error('No previous step');
    }

    this.showStep(prevStep);

    EventsFactory.previousStep({
      formId: this.formM.id,
      current: currStep.getStepId(),
      previous: prevStep.getStepId(),
    });
  }

  public showNextStep(): void {
    const currStep = this.getCurrentStep();
    const nextStep = this.getNextStep();

    if (isNil(nextStep)) {
      throw new Error('No previous step');
    }

    this.showStep(nextStep, true);

    EventsFactory.nextStep({
      formId: this.formM.id,
      current: currStep.getStepId(),
      next: nextStep.getStepId(),
    });
  }

  public reset(): void {
    const firstStep = this.getFirstStep();

    if (isNil(firstStep)) {
      throw new Error('No first step');
    }

    this.showStep(firstStep, true);
    this.stepsP.forEach(FormPresenterHelper.reset);
  }

  public async submitForm(): Promise<void> {
    const formId = this.formM.id;
    const submission = await this.getSubmissionData();
    const signature = this.signatures.getSubmissionSignature();

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
    const stepIndex = this.stepsP.indexOf(stepP);
    const userValues = await this.getFormValues(stepIndex);

    const stepId = stepP.getStepId();
    const signature = this.signatures.getValidationSignature(stepId);

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

    const firstStep = this.getFirstStep();

    if (!isNil(firstStep)) {
      this.showStep(firstStep);
    }

    return element;
  }
}
