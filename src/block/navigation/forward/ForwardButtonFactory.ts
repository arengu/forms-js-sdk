import { IJumpButtonBlockModel, INextButtonBlockModel } from '../../BlockModel';
import { ForwardButtonPresenter, IForwardButtonPresenter } from './ForwardButton';

export const NEXT_CLASSES = ['af-step-next', 'af-step-button'];
export const JUMP_CLASSES = ['af-step-jump', 'af-step-button'];

export const ForwardButtonFactory = {
  fromNextButton(buttonM: INextButtonBlockModel): IForwardButtonPresenter {
    return ForwardButtonPresenter.create(
      buttonM.id,
      {
        button: buttonM.config,
        container: {
          classes: NEXT_CLASSES,
        },
      },
    );
  },

  fromJumpButton(buttonM: IJumpButtonBlockModel): IForwardButtonPresenter {
    return ForwardButtonPresenter.create(
      buttonM.id,
      {
        button: buttonM.config,
        container: {
          classes: JUMP_CLASSES,
        },
      },
    );
  },
}
