import find from 'lodash/find';
import findIndex from 'lodash/findIndex';
import get from 'lodash/get';

import { IStepModel } from '../step/model/StepModel';

export class StackEntry {
  public readonly stepId: string;

  public signature?: string;

  protected constructor(stepId: string, signature?: string) {
    this.stepId = stepId;
    this.signature = signature || undefined;
  }

  public static create(stepId: string, signature?: string): StackEntry {
    return new this(stepId, signature);
  }

  public static fromStep(step: IStepModel): StackEntry {
    return new this(step.id);
  }
}

export class SignatureStack {
  protected steps: StackEntry[];

  protected constructor(steps: StackEntry[]) {
    this.steps = steps;
  }

  public static create(steps: StackEntry[]): SignatureStack {
    return new this(steps);
  }

  public static fromSteps(steps: IStepModel[]): SignatureStack {
    return SignatureStack.create(
      steps.map(StackEntry.fromStep, StackEntry),
    );
  }

  protected getEntryByStepId(stepId: string): StackEntry {
    const entry = find(this.steps, { stepId });

    if (entry == undefined) { // eslint-disable-line eqeqeq
      throw new Error('ID not found');
    }

    return entry;
  }

  protected getEntryByIndex(index: number): StackEntry {
    const entry = get(this.steps, index);

    if (entry == undefined) { // eslint-disable-line eqeqeq
      throw new Error('Index not found');
    }

    return entry;
  }

  protected getIndexByStepId(stepId: string): number {
    const index = findIndex(this.steps, { stepId });

    if (index < 0) {
      throw new Error('ID not found');
    }

    return index;
  }

  public getSignature(stepIndex: number): string | undefined {
    const entry = this.getEntryByIndex(stepIndex);

    const { signature } = entry;

    if (signature != undefined) { // eslint-disable-line eqeqeq
      return signature;
    }

    if (stepIndex === 0) {
      return undefined;
    }

    const prevIndex: number = stepIndex - 1;
    return this.getSignature(prevIndex);
  }

  /**
   * Returns the signature required to submit the form.
   */
  public getSubmissionSignature(): string | undefined {
    const lastIndex = this.steps.length - 1;
    return this.getSignature(lastIndex);
  }

  /**
   * Returns the signature required to validate the current step.
   */
  public getValidationSignature(stepId: string): string | undefined {
    const index = this.getIndexByStepId(stepId);

    /**
     * The signature of the current step is, by definition, not admitted to
     * validate the data of the current one.
     */
    const prevIndex = index - 1;

    if (prevIndex < 0) {
      return undefined;
    }

    return this.getSignature(prevIndex);
  }

  public setSignature(stepId: string, signature: string): void {
    const entry = this.getEntryByStepId(stepId);
    entry.signature = signature;
  }
}
