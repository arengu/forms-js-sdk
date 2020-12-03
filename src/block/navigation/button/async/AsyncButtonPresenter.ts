import { ButtonPresenterImpl, IButtonPresenter, IButtonPresenterOptions } from '../base/ButtonPresenter';
import { AsyncButtonView, IAsyncButtonView } from './AsyncButtonView';

export enum ButtonStatus {
  ENABLED = 'ENABLED',
  DISABLED = 'DISABLED',
}

export interface IAsyncButtonPresenter<T extends IAsyncButtonView = IAsyncButtonView> extends IButtonPresenter<T> {
  showLoading(): void;
  hideLoading(): void;
}

export class AsyncButtonPresenterImpl<T extends IAsyncButtonView> extends ButtonPresenterImpl<T> implements IAsyncButtonPresenter<T> {
  public showLoading(): void {
    this.buttonV.showLoading();
  }

  public hideLoading(): void {
    this.buttonV.hideLoading();
  }

  public reset(): void {
    this.hideLoading();
    super.reset();
  }
}

export const AsyncButtonPresenter =  {
  create(options: IButtonPresenterOptions): IAsyncButtonPresenter {
    return new AsyncButtonPresenterImpl(
      AsyncButtonView.create(options),
      options.button.initStatus,
    );
  }
}
