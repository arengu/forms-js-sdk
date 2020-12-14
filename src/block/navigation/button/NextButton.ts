import { IComponentPresenter } from '../../../component/ComponentPresenter';
import { INextButtonBlockModel } from '../../BlockModel';
import { AsyncButtonView } from './async/AsyncButtonView';
import { IButtonView } from './base/ButtonView';
import { ForwardButtonPresenterImpl, IForwardButtonPresenter } from './forward/ForwardButton';

export const CSS_CLASSES = ['af-step-next', 'af-step-button'];

export type INextButtonPresenter = IForwardButtonPresenter;

export type INextButtonView = IButtonView;

export class NextButtonPresenterImpl extends ForwardButtonPresenterImpl implements INextButtonPresenter {
  public onClick(this: this): void {
    this.listeners.forEach((listener) => listener.onNextButton?.(this));
  }
}

export const NextButtonPresenter = {
  create(buttonM: INextButtonBlockModel): INextButtonPresenter {
    return new NextButtonPresenterImpl(
      buttonM.id,
      AsyncButtonView.create({
        button: {
          text: buttonM.config.text,
        },
        container: {
          classes: CSS_CLASSES,
        },
      })
    );
  },

  matches(compP: IComponentPresenter): compP is INextButtonPresenter {
    return compP instanceof NextButtonPresenterImpl;
  }
}
