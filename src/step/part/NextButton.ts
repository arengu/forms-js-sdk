import { GenericButton, ButtonType } from '../../lib/view/GenericButton';

export const CSS_CLASSES = ['af-step-next', 'af-step-button'];

export class NextButton extends GenericButton {
  public static create(text: string): NextButton {
    return new this(text, ButtonType.SUBMIT, null, CSS_CLASSES);
  }

  public showLoading(): void {
    this.getButton().classList.add('af-button-loading');
  }

  public hideLoading(): void {
    this.getButton().classList.remove('af-button-loading');
  }

  public enable(): void {
    this.getButton().removeAttribute('disabled');
  }

  public disable(): void {
    this.getButton().setAttribute('disabled', 'true');
  }

  public reset(): void {
    this.hideLoading();
    this.enable();
  }
}
