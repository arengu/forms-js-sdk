import { IAsyncButtonPresenter, AsyncButtonPresenterImpl } from "../button/async/AsyncButtonPresenter";
import { IComponentPresenter } from '../../../component/ComponentPresenter';
import { AsyncButtonView, IAsyncButtonView } from '../button/async/AsyncButtonView';
import { IButtonViewOptions } from "../button/base/ButtonView";

export interface IForwardButtonPresenter extends IAsyncButtonPresenter<IForwardButtonView> {
  getId(): string | undefined;
}

export type IForwardButtonView = IAsyncButtonView;

export class ForwardButtonPresenterImpl extends AsyncButtonPresenterImpl<IForwardButtonView> implements IForwardButtonPresenter {
  readonly fieldId: string | undefined;

  public constructor(buttonId: string | undefined, buttonV: IForwardButtonView) {
    super(buttonV);
    this.buttonV.subscribe(this);

    this.fieldId = buttonId;
  }

  public getId(): string | undefined {
    return this.fieldId;
  }

  public onClick(this: this): void {
    this.listeners.forEach((listener) => listener.onGoForward?.(this));
  }
}

export const ForwardButtonPresenter = {
  create(buttonId: string | undefined, options: IButtonViewOptions): IForwardButtonPresenter {
    return new ForwardButtonPresenterImpl(
      buttonId,
      AsyncButtonView.create(options),
    );
  },

  matches(compP: IComponentPresenter): compP is IForwardButtonPresenter {
    return compP instanceof ForwardButtonPresenterImpl;
  }
}
