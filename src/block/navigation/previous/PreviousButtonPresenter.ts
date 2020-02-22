import { IHTMLView } from '../../../base/view/HTMLView';
import { IPreviousButtonBlockModel } from '../../BlockModel';
import { IPreviousButtonView, PreviousButtonView } from './PreviousButtonView';
import { IBlockPresenter } from '../../BlockPresenter';

export interface IPreviousButtonListener {
  onGoPrevious(): void;
}

export type IPreviousButtonPresenter = IBlockPresenter;

export class PreviousButtonPresenter implements IPreviousButtonPresenter {
  protected buttonV: IPreviousButtonView;

  protected constructor(buttonM: IPreviousButtonBlockModel, buttonL: IPreviousButtonListener) {
    this.buttonV = PreviousButtonView.create(buttonM.config.text, () => buttonL.onGoPrevious());
  }

  public getView(): IHTMLView {
    return this.buttonV;
  }

  public reset(): void {
    return this.buttonV.reset();
  }

  public static create(buttonM: IPreviousButtonBlockModel, buttonL: IPreviousButtonListener): IPreviousButtonPresenter {
    return new PreviousButtonPresenter(buttonM, buttonL)
  }
}
