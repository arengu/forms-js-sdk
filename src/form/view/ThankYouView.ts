import { SuccessMessage } from './SuccessMessage';
import { IFormPageView } from './FormView';

export const ThankYouRenderer = {
  renderRoot(successV: SuccessMessage): HTMLDivElement {
    const root = document.createElement('div');
    root.classList.add('af-step-messages');

    root.appendChild(successV.render());

    return root;
  },
};


export class ThankYouView implements IFormPageView {
  protected readonly successV: SuccessMessage;

  protected rootE: HTMLDivElement;

  protected constructor() {
    this.successV = SuccessMessage.create();
    this.rootE = ThankYouRenderer.renderRoot(this.successV);
  }

  public static create(): ThankYouView {
    return new ThankYouView();
  }

  public setMessage(msg: string): void {
    this.successV.setText(msg);
  }

  public clearMessage(): void {
    this.successV.clearText();
  }

  public reset(): void {
    this.clearMessage();
  }

  public render(): HTMLDivElement {
    return this.rootE;
  }
}
