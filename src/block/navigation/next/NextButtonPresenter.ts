import { IHTMLView } from '../../../base/view/HTMLView';
import { INextButtonBlockModel } from '../../BlockModel';
import { INextButtonView, NextButtonView } from './NextButtonView';
import { IBlockPresenter } from '../../BlockPresenter';
import { IComponentPresenter } from '../../../component/ComponentTypes';

export interface INextButtonPresenter extends IBlockPresenter {
  showLoading(): void;
  hideLoading(): void;
  enable(): void;
  disable(): void;
}

export class NextButtonPresenter implements INextButtonPresenter {
  protected buttonV: INextButtonView;

  protected constructor(buttonM: INextButtonBlockModel) {
    this.buttonV = NextButtonView.create(buttonM.config.text);
  }

  public getView(): IHTMLView {
    return this.buttonV;
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

  public enable(): void {
    this.buttonV.enable();
  }

  public disable(): void {
    this.buttonV.disable();
  }

  public static matches(compP: IComponentPresenter): compP is INextButtonPresenter {
    return compP instanceof NextButtonPresenter;
  }

  public static create(buttonM: INextButtonBlockModel): INextButtonPresenter {
    return new NextButtonPresenter(buttonM)
  }
}
