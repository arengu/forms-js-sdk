import { IFormPageView } from '../../form/view/FormView';
import { IStepModel } from '../model/StepModel';
import { IAnyFieldView } from '../../field/view/FieldView';
import { StepErrorMessage } from '../part/StepErrorMessage';
import { NavigationView } from './NavigationView';
import { HTMLHelper } from '../../lib/view/HTMLHelper';
import { IComponentView } from '../../component/ComponentView';

export interface IStepViewListener {
  onGoBack(this: this): void;
}

export interface IStepView extends IFormPageView {
  showLoading(this: this): void;
  hideLoading(this: this): void;

  disableNavigation(this: this): void;
  enableNavigation(this: this): void;

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
    errorV: StepErrorMessage, navV: NavigationView): HTMLDivElement {
    const { id } = stepM;

    const root = document.createElement('div');
    root.classList.add(`af-step-${id}`);
    root.classList.add('af-step');

    compsV.map((cV) => cV.render())
      .forEach(HTMLHelper.appendChild(root));

    root.appendChild(this.renderMessage(errorV));
    root.appendChild(navV.render());

    return root;
  }
}

export class StepView implements IStepView {
  protected readonly fieldsV: IAnyFieldView[];

  protected readonly errorV: StepErrorMessage;

  protected readonly navV: NavigationView;

  protected readonly rootE: HTMLDivElement;

  protected constructor(stepM: IStepModel, fieldsV: IAnyFieldView[], viewL: IStepViewListener) {
    this.fieldsV = fieldsV;
    this.errorV = StepErrorMessage.create();
    this.navV = NavigationView.create(stepM.buttons, viewL);

    this.rootE = StepRenderer.renderRoot(stepM, fieldsV, this.errorV, this.navV);
  }

  public static create(stepM: IStepModel, fieldsV: IAnyFieldView[],
    viewL: IStepViewListener): IStepView {
    return new this(stepM, fieldsV, viewL);
  }

  public enableNavigation(): void {
    this.navV.enableNext();
  }

  public disableNavigation(): void {
    this.navV.disableNext();
  }

  public reset(): void {
    this.errorV.reset();
    this.navV.reset();
  }

  public showLoading(): void {
    this.navV.showLoading();
  }

  public hideLoading(): void {
    this.navV.hideLoading();
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
