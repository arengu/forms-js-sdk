import { GenericButtonView, ButtonType, IGenericButtonView } from '../GenericButtonView';

export const CSS_CLASSES = ['af-step-previous', 'af-step-button'];

export interface IPreviousButtonCallback {
  (this: void): void;
}

export type IPreviousButtonView = IGenericButtonView;

export class PreviousButtonView extends GenericButtonView {
  protected constructor(text: string, callback?: IPreviousButtonCallback) {
    super({
      text,
      type: ButtonType.BUTTON,
      callback,
      containerClasses: CSS_CLASSES,
    });
  }

  public static create(text: string, callback?: IPreviousButtonCallback): IPreviousButtonView {
    return new PreviousButtonView(text, callback);
  }
}
