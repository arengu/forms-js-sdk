import { BaseComponentPresenter } from '../../core/BasePresenters';
import { IBlockPresenter } from '../../block/BlockPresenter';
import { StepErrorView, IStepErrorView } from './StepErrorView';

export interface IStepErrorPresenter extends IBlockPresenter {
  setError(msg: string): void;
  clearError(): void;
}

export class StepErrorPresenter extends BaseComponentPresenter implements IStepErrorPresenter {
  protected readonly errorV: IStepErrorView;

  protected constructor() {
    super();
    this.errorV = StepErrorView.create();
  }

  public static create(): IStepErrorPresenter {
    return new StepErrorPresenter();
  }

  public render(): HTMLElement {
    return this.errorV.render();
  }

  public reset(): void {
    return this.errorV.reset();
  }

  public setError(msg: string): void {
    return this.errorV.setText(msg);
  }

  public clearError(): void {
    return this.errorV.clearText();
  }
}
