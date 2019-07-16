import { GenericButton, IButtonCallback, ButtonType } from '../../lib/view/GenericButton';

export const CSS_CLASSES = ['af-step-previous', 'af-step-button'];

export class PreviousButton extends GenericButton {
  public static create(text: string, callback: IButtonCallback): PreviousButton {
    return new this(text, ButtonType.BUTTON, callback, CSS_CLASSES);
  }
}
