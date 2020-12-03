import { IButtonStyle } from '../button/base/ButtonView';
import { IAsyncButtonView, AsyncButtonView } from '../button/async/AsyncButtonView';

export const CSS_CLASSES = ['af-step-jump', 'af-step-button'];

export type IJumpButtonView = IAsyncButtonView;

export const JumpButtonView = {
  create(text: string, style: IButtonStyle): IJumpButtonView {
    return AsyncButtonView.create({
      button: {
        text,
        style,
      },
      container: {
        classes: CSS_CLASSES,
      },
    });
  },
};
