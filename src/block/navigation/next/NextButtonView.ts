import { AsyncButtonView, IAsyncButtonView } from '../button/async/AsyncButtonView';

export const CSS_CLASSES = ['af-step-next', 'af-step-button'];

export type INextButtonView = IAsyncButtonView;

export const NextButtonView = {
  create(text: string): INextButtonView {
    return AsyncButtonView.create({
      button: {
        text,
      },
      container: {
        classes: CSS_CLASSES,
      },
    });
  },
};
