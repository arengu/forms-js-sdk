import { IFormPageView } from '../../form/view/FormView';
import { IStepModel } from '../model/StepModel';
import { HTMLHelper } from '../../lib/view/HTMLHelper';

export type IStepView = IFormPageView;

export abstract class StepRenderer {
  public static renderRoot(stepM: IStepModel, compsE: HTMLElement[]): HTMLDivElement {
    const { id } = stepM;

    const root = document.createElement('div');
    root.classList.add(`af-step-${id}`);
    root.classList.add('af-step');

    compsE.forEach(HTMLHelper.appendChild(root));

    return root;
  }
}

export class StepView implements IStepView {
  protected readonly rootE: HTMLDivElement;

  protected constructor(stepM: IStepModel, compsE: HTMLElement[]) {
    this.rootE = StepRenderer.renderRoot(stepM, compsE);
  }

  public static create(stepM: IStepModel, compsE: HTMLElement[]): IStepView {
    return new StepView(stepM, compsE);
  }

  public reset(): void {
    // nothing to do here
  }

  public render(): HTMLDivElement {
    return this.rootE;
  }
}
