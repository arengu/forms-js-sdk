import { ButtonType, IButtonView, ButtonView } from '../button/base/ButtonView';

export const CSS_CLASSES = ['af-step-previous', 'af-step-button'];

export type IPreviousButtonView = IButtonView;

export const PreviousButtonView = {
  create(text: string): IPreviousButtonView {
    return ButtonView.create({
      button: {
        text,
        type: ButtonType.BUTTON,
      },
      container: {
        classes: CSS_CLASSES,
      },
    });
  },
};
