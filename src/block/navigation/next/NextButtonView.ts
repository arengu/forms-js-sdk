import { AsyncButtonView, IAsyncButtonView } from '../button/async/AsyncButtonView';
import { ButtonType } from '../button/base/ButtonView';

export const CSS_CLASSES = ['af-step-next', 'af-step-button'];

export type INextButtonView = IAsyncButtonView;

export const NextButtonView = {
  create(text: string): INextButtonView {
    return AsyncButtonView.create({
      button: {
        text,
        type: ButtonType.SUBMIT,
      },
      container: {
        classes: CSS_CLASSES,
      },
    });
  },
};
