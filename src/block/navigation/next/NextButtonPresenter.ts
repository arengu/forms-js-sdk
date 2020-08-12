import { INextButtonBlockModel } from '../../BlockModel';
import { INextButtonView, NextButtonView } from './NextButtonView';
import { IBlockPresenter } from '../../BlockPresenter';
import { IComponentPresenter } from '../../../component/ComponentPresenter';
import { BaseBlockPresenter } from '../../../core/BasePresenters';

export interface INextButtonPresenter extends IBlockPresenter {
  showLoading(): void;
  hideLoading(): void;
  block(): void;
  unblock(): void;
}

export class NextButtonPresenter extends BaseBlockPresenter implements INextButtonPresenter {
  protected buttonV: INextButtonView;

  protected constructor(buttonM: INextButtonBlockModel) {
    super();
    this.buttonV = NextButtonView.create(buttonM.config.text);
  }

  public render(): HTMLElement {
    return this.buttonV.render();
  }

  public reset(): void {
    return this.buttonV.reset();
  }

  public showLoading(): void {
    this.buttonV.showLoading();
  }

  public hideLoading(): void {
    this.buttonV.hideLoading();
  }

  public block(): void {
    this.buttonV.block();
  }

  public unblock(): void {
    this.buttonV.unblock();
  }

  public static matches(compP: IComponentPresenter): compP is INextButtonPresenter {
    return compP instanceof NextButtonPresenter;
  }

  public static create(buttonM: INextButtonBlockModel): INextButtonPresenter {
    return new NextButtonPresenter(buttonM)
  }
}
