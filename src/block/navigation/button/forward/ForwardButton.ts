import { IAsyncButtonPresenter, AsyncButtonPresenterImpl } from "../async/AsyncButtonPresenter";
import { IAsyncButtonView } from '../async/AsyncButtonView';

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
    throw new Error('Not implemented yet');
  }
}
