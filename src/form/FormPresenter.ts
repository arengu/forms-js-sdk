import find from 'lodash/find';
import isNil from 'lodash/isNil';

import { HiddenFields, IHiddenFieldValue, IHiddenFieldValues } from './HiddenFields';

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
import { IFormInteractionResponse, EffectType, IFormInteractionRequest, IEffectAuthenticatePayment, IReplacements } from './FormInteraction';
import { IPresenter } from '../core/BaseTypes';
import { StyleHelper } from './view/StyleHelper';
import { INextButtonPresenter } from '../block/navigation/button/NextButton';
import { IJumpButtonPresenter } from '../block/navigation/button/JumpButton';
import { IPaymentFieldPresenter, PaymentFieldPresenter } from '../field/presenter/presenter/PaymentFieldPresenter';
import { IFieldPresenter } from '../field/presenter/presenter/FieldPresenter';
import { MagicResolver } from '../lib/MagicResolver';

export interface IArenguForm {
  getId(): string;
  setHiddenField(key: string, value: unknown): IHiddenFieldValue;
  updateStyle(style: IFormStyle): void;
}

export const ArenguForm = {
  create(formP: IFormPresenter): IArenguForm {
    return {
      getId(): string {
        return formP.getFormId();
      },
      setHiddenField(fieldId: string, value: unknown): IHiddenFieldValue {
        return formP.setHiddenField(fieldId, value);
      },
      updateStyle(style: IFormStyle): void {
        formP.updateStyle(style);
      },
    };
  },
};

export const FormPresenterHelper = {
  getUserValues(stepP: IStepPresenter): Promise<IUserValues> {
    return stepP.getUserValues();
  },

  reset(presenter: IStepPresenter): void {
    return presenter.reset();
  },

  getField(stepsP: IStepPresenter[], fieldId: string): IFieldPresenter | undefined {
    for (const sP of stepsP) {
      const fP = sP.getFieldPresenter(fieldId);

      if (fP) {
        return fP;
      }
    }
  },

  getPaymentField(stepsP: IStepPresenter[], fieldId: string): IPaymentFieldPresenter | undefined {
    const fieldP = this.getField(stepsP, fieldId);

    if (fieldP && PaymentFieldPresenter.matches(fieldP)) {
      return fieldP;
    }
  }
};

export interface IFormPresenter extends IPresenter {
  getFormId(): string;
  setHiddenField(fieldId: string, value: unknown): IHiddenFieldValue;
  render(): HTMLElement;
  updateStyle(style: IFormStyle): void;
  getPublicInstance(): IArenguForm;
}

interface IComponentWithLoader {
  showLoading(): void;
  hideLoading(): void;
}

export interface IFormDeps {
  style: IExtendedFormStyle;
  social: ISocialProviderConfig[];
  messages: Messages;
  instance: IArenguForm;
}

enum ButtonType {
  NEXT = 'NEXT',
  JUMP = 'JUMP',
  SOCIAL = 'SOCIAL',
}

export class FormPresenter implements IFormPresenter, IFormViewListener, IStepPresenterListener {
  protected readonly formM: IFormModel;
  protected readonly formI: IArenguForm;
  protected readonly hiddenFields: HiddenFields;

  protected readonly formV: IFormView;
  protected readonly style: IExtendedFormStyle;

  protected currentStep?: IStepPresenter;
  protected readonly stepsP: IStepPresenter[];

  protected readonly confV: ThankYouView;

  protected readonly history: NavigationHistory;
  protected readonly signatures: Map<string, string>;
  protected readonly replacements: Map<string, IReplacements>;

  protected constructor(formM: IFormModel) {
    this.formM = formM;
    this.formI = ArenguForm.create(this);
    this.hiddenFields = HiddenFields.create(formM.hiddenFields);

    this.style = StyleHelper.extendStyle(formM.style);

    const formD: IFormDeps = {
      style: this.style,
      social: formM.social,
      messages: Messages.create(formM.messages),
      instance: this.formI,
    };

    this.formV = FormView.create(formM, this);

    this.currentStep = undefined;
    this.stepsP = formM.steps.map((sM): IStepPresenter => StepPresenter.create(sM, formD, this));

    this.confV = ThankYouView.create();

    this.history = NavigationHistory.create();

    this.signatures = new Map();
    this.replacements = new Map();
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
    const steps = this.history.getSequence().concat(this.getCurrentStep());

    const proms = steps.map((sP) => FormPresenterHelper.getUserValues(sP));
    const userValuesPerStep = await Promise.all(proms);

    const userValues = Object.assign({}, ...userValuesPerStep);

    return userValues;
  }

  public getHiddenFields(): IHiddenFieldValues {
    return this.hiddenFields.getAll();
  }

  public setHiddenField(fieldId: string, value: unknown): IHiddenFieldValue {
    return this.hiddenFields.setValue(fieldId, value);
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
  public async getSubmissionData(buttonId?: string): Promise<ISubmissionData> {
    return {
      buttonId,
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

  public getReplacementsForNextStep(): IReplacements {
    const steps = [this.getCurrentStep(), ...this.history.getHistory()];

    for (const step of steps) {
      const stepId = step.getStepId();
      const repls = this.replacements.get(stepId);

      if (repls) {
        return repls;
      }
    }

    return {};
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

  public onPreviousButton(): void {
    this.gotoPreviousStep();
  }

  public onNextButton(buttonP: INextButtonPresenter, stepP: IStepPresenter): void {
    this.goForward(buttonP, stepP, ButtonType.NEXT, buttonP.getId());
  }

  public onJumpButton(buttonP: IJumpButtonPresenter, stepP: IStepPresenter): void {
    this.goForward(buttonP, stepP, ButtonType.JUMP, buttonP.getId());
  }

  public onSubmitForm(): void {
    this.getCurrentStep().fireNextStep();
  }

  public async onSocialLogin(compP: ISocialFieldPresenter, stepP: IStepPresenter): Promise<void> {
    await this.goForward(compP, stepP, ButtonType.SOCIAL, compP.getFieldId());
  }

  public async goForward(compP: IComponentWithLoader, stepP: IStepPresenter, buttonType: ButtonType, buttonId?: string): Promise<void> {
    try {
      compP.showLoading();
      stepP.blockComponents();

      const stepVal = await stepP.validateFields();

      if (!stepVal.valid) {
        return;
      }

      const flowRes = await this.executeFlow(stepP, buttonType, buttonId);

      if (flowRes) {
        return;
      }

      if (this.isLastStep()) {
        await this.submitForm(stepP, buttonId);
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

  public async handlePaymentAuthentication(currStep: IStepPresenter, effect: IEffectAuthenticatePayment): Promise<void> {
    const pf = FormPresenterHelper.getPaymentField(this.stepsP, effect.fieldId);

    try {
      await pf?.authenticate(effect.data);
      await this.submitForm(currStep);
    } catch (err) {
      currStep.handleAnyError(err);
      this.signatures.delete(currStep.getStepId());
    }
  }

  public async handleFormInteraction(currStep: IStepPresenter, req: IFormInteractionRequest, res: IFormInteractionResponse): Promise<void> {
    FormView.setCookies(res.cookies);

    const { effect } = res;

    if ('replacements' in effect) {
      this.replacements.set(currStep.getStepId(), effect.replacements);
    }

    if (effect.type === EffectType.ERROR_MESSAGE) {
      this.signatures.delete(currStep.getStepId());

      DOMEvents.emit(
        EventNames.FormEffectErrorMessage,
        {
          formId: req.formId,
          stepId: req.stepId,
          message: effect.message,
        },
      );
      currStep.handleAnyError(effect.message);
      return;
    }

    if (effect.type === EffectType.AUTHN_PAYMENT) {
      this.signatures.set(currStep.getStepId(), effect.signature);
      await this.handlePaymentAuthentication(currStep, effect);
      return;
    }

    if (effect.type === EffectType.SUBMIT_FORM) {
      this.signatures.set(currStep.getStepId(), effect.signature);
      await this.submitForm(currStep);
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
        await this.submitForm(currStep, req.buttonId);
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

  public setCurrentStep(newStep: IStepPresenter): void {
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

    const replacements = {}; // no replacements on first step
    const hiddenFields = this.getHiddenFields(); // no user values on first step

    const resolver = MagicResolver.create(hiddenFields, replacements);

    firstStep.updateStep(resolver);

    this.setCurrentStep(firstStep);
  }

  public gotoPreviousStep(): void {
    const prevStep = this.history.popStep();

    if (isNil(prevStep)) {
      return;
    }

    const currStep = this.getCurrentStep();

    currStep.clearAllErrors();

    this.setCurrentStep(prevStep);

    DOMEvents.emit(EventNames.PreviousStep, {
      formId: this.formM.id,
      current: currStep.getStepId(),
      previous: prevStep.getStepId(),
    });
  }

  public async gotoNextStep(): Promise<void> {
    const nextStep = this.getNextStep();

    if (nextStep) {
      await this.jumpToStep(nextStep);
    }
  }

  public async jumpToStep(nextStep: IStepPresenter): Promise<void> {
    const currStep = this.getCurrentStep();

    this.history.pushStep(currStep);

    const replacements = this.getReplacementsForNextStep();
    const formValues = await this.getFormValues();

    const resolver = MagicResolver.create(formValues, replacements);

    nextStep.updateStep(resolver);

    this.setCurrentStep(nextStep);

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

  public async submitForm(currStep: IStepPresenter, buttonId?: string): Promise<void> {
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
      await this.handleFormInteraction(currStep, interReq, interRes);
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

  public async executeFlow(currStep: IStepPresenter, buttonType: ButtonType, buttonId: string | undefined): Promise<IFormInteractionResponse | undefined> {
    if (!currStep.hasFlow() && buttonType !== ButtonType.JUMP) {
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

    await this.handleFormInteraction(currStep, interReq, interRes);

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

  public getPublicInstance(): IArenguForm {
    return this.formI;
  }
}
