import find from 'lodash/find';
import findIndex from 'lodash/findIndex';
import get from 'lodash/get';

import { IStepModel } from '../step/model/StepModel';

export class StackEntry {
  public readonly stepId: string;

  public signature: null | string;

  protected constructor(stepId: string, signature?: null | string) {
    this.stepId = stepId;
    this.signature = signature || null;
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

    if (entry === undefined) {
      throw new Error('ID not found');
    }

    return entry;
  }

  protected getEntryByIndex(index: number): StackEntry {
    const entry = get(this.steps, index);

    if (entry === undefined) {
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

  public getSignature(stepIndex: number): null | string {
    const entry = this.getEntryByIndex(stepIndex);

    const { signature } = entry;

    if (signature !== null) {
      return signature;
    }

    if (stepIndex === 0) {
      return null;
    }

    const prevIndex: number = stepIndex - 1;
    return this.getSignature(prevIndex);
  }

  /**
   * Returns the signature required to submit the form.
   */
  public getSubmissionSignature(): null | string {
    const lastIndex = this.steps.length - 1;
    return this.getSignature(lastIndex);
  }

  /**
   * Returns the signature required to validate the current step.
   */
  public getValidationSignature(stepId: string): null | string {
    const index = this.getIndexByStepId(stepId);

    /**
     * The signature of the current step is, by definition, not admitted to
     * validate the data of the current one.
     */
    const prevIndex = index - 1;

    if (prevIndex < 0) {
      return null;
    }

    return this.getSignature(prevIndex);
  }

  public setSignature(stepId: string, signature: string): void {
    const entry = this.getEntryByStepId(stepId);
    entry.signature = signature;
  }
}
