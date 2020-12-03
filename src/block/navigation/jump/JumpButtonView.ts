import { ButtonType, IButtonView, ButtonView, IButtonStyle } from '../button/base/ButtonView';

export const CSS_CLASSES = ['af-step-jump', 'af-step-button'];

export type IJumpButtonView = IButtonView;

export const JumpButtonView = {
  create(text: string, style: IButtonStyle): IJumpButtonView {
    return ButtonView.create({
      button: {
        text,
        type: ButtonType.BUTTON,
        style,
      },
      container: {
        classes: CSS_CLASSES,
      },
    });
  },
};
