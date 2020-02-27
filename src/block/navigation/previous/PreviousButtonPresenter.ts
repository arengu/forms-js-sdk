import { IHTMLView } from '../../../base/view/HTMLView';
import { IPreviousButtonBlockModel } from '../../BlockModel';
import { IPreviousButtonView, PreviousButtonView } from './PreviousButtonView';
import { IBlockPresenter } from '../../BlockPresenter';
import { BaseComponentPresenter } from '../../../component/ComponentHelper';

export type IPreviousButtonPresenter = IBlockPresenter;

export class PreviousButtonPresenter extends BaseComponentPresenter implements IPreviousButtonPresenter {
  protected buttonV: IPreviousButtonView;

  protected constructor(buttonM: IPreviousButtonBlockModel) {
    super();
    this.buttonV = PreviousButtonView.create(buttonM.config.text, () => this.onPrevious());
  }

  public static create(buttonM: IPreviousButtonBlockModel): IPreviousButtonPresenter {
    return new PreviousButtonPresenter(buttonM)
  }

  public onPrevious(): void {
    this.listeners.forEach((listener) => listener.onGoToPrevious && listener.onGoToPrevious(this));
  }

  public getView(): IHTMLView {
    return this.buttonV;
  }

  public reset(): void {
    return this.buttonV.reset();
  }

  public block(): void {
    this.buttonV.block();
  }

  public unblock(): void {
    this.buttonV.unblock();
  }
}
