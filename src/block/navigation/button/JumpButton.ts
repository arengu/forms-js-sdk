import { IComponentPresenter } from '../../../component/ComponentPresenter';
import { IJumpButtonBlockModel } from '../../BlockModel';
import { AsyncButtonView } from './async/AsyncButtonView';
import { IButtonView } from './base/ButtonView';
import { ForwardButtonPresenterImpl, IForwardButtonPresenter } from './forward/ForwardButton';

export const CSS_CLASSES = ['af-step-jump', 'af-step-button'];

export type IJumpButtonPresenter = IForwardButtonPresenter;

export type IJumpButtonView = IButtonView;

export class JumpButtonPresenterImpl extends ForwardButtonPresenterImpl implements IJumpButtonPresenter {
  public onClick(this: this): void {
    this.listeners.forEach((listener) => listener.onJumpButton?.(this));
  }
}

export const JumpButtonPresenter = {
  create(buttonM: IJumpButtonBlockModel): IJumpButtonPresenter {
    return new JumpButtonPresenterImpl(
      buttonM.id,
      AsyncButtonView.create({
        button: {
          text: buttonM.config.text,
          style: buttonM.config.style,
        },
        container: {
          classes: CSS_CLASSES,
        },
      })
    );
  },

  matches(compP: IComponentPresenter): compP is IJumpButtonPresenter {
    return compP instanceof JumpButtonPresenterImpl;
  }
}
