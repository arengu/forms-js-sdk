import { INextButtonBlockModel } from '../../BlockModel';
import { INextButtonView, NextButtonView } from './NextButtonView';
import { IComponentPresenter } from '../../../component/ComponentPresenter';
import { AsyncButtonPresenterImpl, IAsyncButtonPresenter } from "../button/async/AsyncButtonPresenter";

export type INextButtonPresenter = IAsyncButtonPresenter<INextButtonView>;

export class NextButtonPresenterImpl extends AsyncButtonPresenterImpl<INextButtonView> implements INextButtonPresenter {
}

export const NextButtonPresenter = {
  create(buttonM: INextButtonBlockModel): INextButtonPresenter {
    return new NextButtonPresenterImpl(
      NextButtonView.create(buttonM.config.text),
    );
  },

  matches(compP: IComponentPresenter): compP is INextButtonPresenter {
    return compP instanceof NextButtonPresenterImpl;
  }
}
