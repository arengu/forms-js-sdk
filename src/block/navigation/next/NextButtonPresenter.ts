import { INextButtonBlockModel } from '../../BlockModel';
import { INextButtonView, NextButtonView } from './NextButtonView';
import { IComponentPresenter } from '../../../component/ComponentPresenter';
import { AsyncButtonPresenterImpl, IAsyncButtonPresenter } from "../button/async/AsyncButtonPresenter";

export interface INextButtonPresenter extends IAsyncButtonPresenter<INextButtonView> {
  getId(): string | undefined;
}

export class NextButtonPresenterImpl extends AsyncButtonPresenterImpl<INextButtonView> implements INextButtonPresenter {
  readonly fieldId: string | undefined;

  public constructor(buttonM: INextButtonBlockModel, buttonV: INextButtonView) {
    super(buttonV);

    this.buttonV.subscribe(this);

    this.fieldId = buttonM.id;
  }

  public getId(): string | undefined {
    return this.fieldId;
  }

  public onClick(this: this): void {
    this.listeners.forEach((listener) => listener.onGoForward?.(this));
  }
}

export const NextButtonPresenter = {
  create(buttonM: INextButtonBlockModel): INextButtonPresenter {
    return new NextButtonPresenterImpl(
      buttonM,
      NextButtonView.create(buttonM.config.text),
    );
  },

  matches(compP: IComponentPresenter): compP is INextButtonPresenter {
    return compP instanceof NextButtonPresenterImpl;
  }
}
