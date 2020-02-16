import { IStepPresenter } from "../step/presenter/StepPresenter";

export class NavigationHistory {
  private stack: IStepPresenter[];

  public constructor() {
    this.stack = [];
  }

  /**
   * This method **mutates** the state.
   */
  public pushStep(stepP: IStepPresenter): void {
    this.stack.push(stepP);
  }

  /**
   * This method **mutates** the state.
   */
  public popStep(): IStepPresenter | undefined {
    return this.stack.pop();
  }

  public clearHistory(): void {
    this.stack = [];
  }

  public latestStep(): IStepPresenter | undefined {
    return this.stack.slice(-1)[0];
  }

  /**
   * Returns the list of arrays sorted from the most recent to the first
   */
  public getHistory(): IStepPresenter[] {
    return this.stack.reverse();
  }

  /**
   * Returns the list of arrays sorted from the first to the most recent
   */
  public getSequence(): IStepPresenter[] {
    return Array.from(this.stack);
  }

  public isEmpty(): boolean {
    return this.stack.length === 0;
  }

  public static create(): NavigationHistory {
    return new NavigationHistory();
  }
}
