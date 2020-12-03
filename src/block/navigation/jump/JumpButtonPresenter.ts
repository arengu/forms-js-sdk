import { IJumpButtonBlockModel } from '../../BlockModel';
import { IJumpButtonView, JumpButtonView } from './JumpButtonView';
import { IBlockPresenter } from '../../BlockPresenter';
import { ButtonPresenterImpl } from "../button/base/ButtonPresenter";

export type IJumpButtonPresenter = IBlockPresenter;

export class JumpButtonPresenterImpl extends ButtonPresenterImpl<IJumpButtonView> implements IJumpButtonPresenter {
  public constructor(buttonV: IJumpButtonView) {
    super(buttonV);
    this.buttonV.subscribe(this);
  }

  public onClick(this: this): void {
    this.listeners.forEach((listener) => listener.onGoToPrevious?.(this));
  }
}

export const JumpButtonPresenter = {
  create(buttonM: IJumpButtonBlockModel): IJumpButtonPresenter {
    return new JumpButtonPresenterImpl(
      JumpButtonView.create(buttonM.config.text, buttonM.config.style),
    );
  },
}
