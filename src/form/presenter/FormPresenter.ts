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

const FIRST_STEP = 0;

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
}

export class FormPresenter implements IFormPresenter, IFormViewListener, IStepListener {
  protected readonly formM: IFormModel;

  protected readonly formV: IFormView;

  protected readonly confV: ThankYouView;

  protected readonly stepsP: IStepPresenter[];

  protected readonly hiddenFields: HiddenFields;

  protected readonly signatures: SignatureStack;

  protected readonly messages: Messages;

  protected currentStep: number;

  protected constructor(formM: IFormModel, hiddenFields: HiddenFields, messages: Messages) {
    const { steps } = formM;
    this.formM = formM;
    this.formV = FormView.create(formM, this);
    this.confV = ThankYouView.create();
    this.stepsP = Array(steps.length);
    this.hiddenFields = hiddenFields;
    this.signatures = SignatureStack.fromSteps(steps);
    this.messages = messages;

    this.currentStep = -1;

    this.showStep(FIRST_STEP);
  }

  public static create(model: IFormModel, hiddenFields: HiddenFields,
    messages: Messages): IFormPresenter {
    return new this(model, hiddenFields, messages);
  }

  public getFormId(): string {
    return this.formM.id;
  }

  public getCurrentStep(): IStepPresenter {
    return this.stepsP[this.currentStep];
  }

  public getPresenter(index: number): IStepPresenter {
    const chosenPresenter = this.stepsP[index];

    if (chosenPresenter != undefined) { // eslint-disable-line eqeqeq
      return chosenPresenter;
    }

    const chosenModel = this.formM.steps[index];

    if (chosenModel == undefined) { // eslint-disable-line eqeqeq
      throw new Error('Step not found');
    }

    const newPresenter = StepPresenter.create(chosenModel, this, this.messages);

    this.stepsP[index] = newPresenter;

    return newPresenter;
  }

  /**
   * @param stepIndex Index of the last step you want to get value from
   */
  public async getUserValues(stepIndex?: number): Promise<IFormData> {
    const steps = (stepIndex != undefined) // eslint-disable-line eqeqeq
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
    this.hiddenFields.set(fieldId, value);
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

  public showStep(index: number, scroll?: boolean): void {
    const chosenStepP = this.getPresenter(index);

    this.currentStep = index;
    this.formV.showPage(chosenStepP.getView());

    if (scroll === true) {
      this.formV.scrollTopIfNeeded();
    }
  }

  public showPreviousStep(): void {
    const currStep = this.getCurrentStep();
    this.showStep(this.currentStep - 1);
    const prevStep = this.getCurrentStep();

    EventsFactory.previousStep({
      formId: this.formM.id,
      current: currStep.getStepId(),
      previous: prevStep.getStepId(),
    });
  }

  public showNextStep(): void {
    const currStep = this.getCurrentStep();
    this.showStep(this.currentStep + 1, true);
    const nextStep = this.getCurrentStep();

    EventsFactory.nextStep({
      formId: this.formM.id,
      current: currStep.getStepId(),
      next: nextStep.getStepId(),
    });
  }

  public reset(): void {
    this.showStep(FIRST_STEP, true);
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
    const userValues = await this.getUserValues(stepIndex);

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

    if (this.stepsP.length > 0) {
      this.showStep(FIRST_STEP);
    }

    return element;
  }
}
