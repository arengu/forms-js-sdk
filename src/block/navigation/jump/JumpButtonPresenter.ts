import { IJumpButtonBlockModel } from '../../BlockModel';
import { IJumpButtonView, JumpButtonView } from './JumpButtonView';
import { IAsyncButtonPresenter, AsyncButtonPresenterImpl } from "../button/async/AsyncButtonPresenter";

export type IJumpButtonPresenter = IAsyncButtonPresenter<IJumpButtonView>;

export class JumpButtonPresenterImpl extends AsyncButtonPresenterImpl<IJumpButtonView> implements IJumpButtonPresenter {
  public constructor(buttonV: IJumpButtonView) {
    super(buttonV);
    this.buttonV.subscribe(this);
  }

  public onClick(this: this): void {
    this.listeners.forEach((listener) => listener.onGoForward?.(this));
  }
}

export const JumpButtonPresenter = {
  create(buttonM: IJumpButtonBlockModel): IJumpButtonPresenter {
    return new JumpButtonPresenterImpl(
      JumpButtonView.create(buttonM.config.text, buttonM.config.style),
    );
  },
}
