import { IPreviousButtonBlockModel } from '../../BlockModel';
import { IPreviousButtonView, PreviousButtonView } from './PreviousButtonView';
import { IBlockPresenter } from '../../BlockPresenter';
import { ButtonPresenterImpl } from "../button/base/ButtonPresenter";

export type IPreviousButtonPresenter = IBlockPresenter;

export class PreviousButtonPresenterImpl extends ButtonPresenterImpl<IPreviousButtonView> implements IPreviousButtonPresenter {
  public constructor(buttonV: IPreviousButtonView) {
    super(buttonV);
    this.buttonV.subscribe(this);
  }

  public onClick(this: this): void {
    this.listeners.forEach((listener) => listener.onGoToPrevious?.(this));
  }
}

export const PreviousButtonPresenter = {
  create(buttonM: IPreviousButtonBlockModel): IPreviousButtonPresenter {
    return new PreviousButtonPresenterImpl(
      PreviousButtonView.create(buttonM.config.text),
    );
  },
}
