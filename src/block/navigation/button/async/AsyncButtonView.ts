import { ButtonViewImpl, IButtonViewSubscriber, IButtonView, IButtonViewOptions } from "../base/ButtonView";

export interface IAsyncButtonView<S extends IButtonViewSubscriber = IButtonViewSubscriber> extends IButtonView<S> {
  showLoading(): void;
  hideLoading(): void;
}

export const AsyncButtonRenderer = {
  appendLadda(buttonE: HTMLButtonElement): HTMLSpanElement {
    const ladda = document.createElement('span');
    ladda.classList.add('af-button-ladda');
    buttonE.appendChild(ladda);

    return ladda;
  }
}

const LOADING_CLASS = 'af-button-loading';

export class AsyncButtonViewImpl<S extends IButtonViewSubscriber = IButtonViewSubscriber> extends ButtonViewImpl<S> implements IButtonView<S> {
  public constructor(options: IButtonViewOptions) {
    super(options);
    AsyncButtonRenderer.appendLadda(this.buttonE);
  }

  public showLoading(): void {
    this.buttonE.classList.add(LOADING_CLASS);
  }

  public hideLoading(): void {
    this.buttonE.classList.remove(LOADING_CLASS);
  }
}

export const AsyncButtonView = {
  create(options: IButtonViewOptions): IAsyncButtonView {
    return new AsyncButtonViewImpl(options);
  },
};
