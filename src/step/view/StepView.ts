import { IFormPageView } from '../../form/view/FormView';
import { IStepModel } from '../model/StepModel';
import { StepErrorMessage } from '../part/StepErrorMessage';
import { HTMLHelper } from '../../lib/view/HTMLHelper';
import { IComponentView } from '../../component/ComponentTypes';

export interface IStepView extends IFormPageView {
  setError(this: this, msg: string): void;
  clearError(this: this): void;
}

export abstract class StepRenderer {
  public static renderMessage(msgV: StepErrorMessage): HTMLDivElement {
    const wrapper = document.createElement('div');
    wrapper.classList.add('af-step-messages');

    wrapper.appendChild(msgV.render());

    return wrapper;
  }

  public static renderRoot(stepM: IStepModel, compsV: IComponentView[],
    errorV: StepErrorMessage): HTMLDivElement {
    const { id } = stepM;

    const root = document.createElement('div');
    root.classList.add(`af-step-${id}`);
    root.classList.add('af-step');

    compsV.map((cV) => cV.render())
      .forEach(HTMLHelper.appendChild(root));

    root.appendChild(this.renderMessage(errorV));
    // root.appendChild(navV.render());

    return root;
  }
}

export class StepView implements IStepView {
  protected readonly compsV: IComponentView[];

  protected readonly errorV: StepErrorMessage;

  protected readonly rootE: HTMLDivElement;

  protected constructor(stepM: IStepModel, compsV: IComponentView[]) {
    this.compsV = compsV;
    this.errorV = StepErrorMessage.create();

    this.rootE = StepRenderer.renderRoot(stepM, compsV, this.errorV);
  }

  public static create(stepM: IStepModel, compsV: IComponentView[]): IStepView {
    return new StepView(stepM, compsV);
  }

  public reset(): void {
    this.errorV.reset();
  }

  public setError(msg: string): void {
    return this.errorV.setText(msg);
  }

  public clearError(): void {
    return this.errorV.clearText();
  }

  public render(): HTMLDivElement {
    return this.rootE;
  }
}
