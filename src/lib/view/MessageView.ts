import { IView } from "../../core/BaseTypes";
import { HTMLHelper } from './HTMLHelper';

export interface IMessageView extends IView {
  setText(txt: string): void;
  clearText(): void;
  reset(): void;
}

export abstract class GenericMessageRenderer {
  public static renderText(): HTMLElement {
    return document.createElement('p');
  }

  public static renderRoot(cssClasses: string[], textE: HTMLElement): HTMLElement {
    const container = document.createElement('div');
    cssClasses.forEach(HTMLHelper.addClass(container));
    container.classList.add('af-message');

    container.appendChild(textE);

    return container;
  }
}

export class MessageView implements IMessageView {
  protected textE: HTMLElement;

  protected rootE: HTMLElement;

  protected constructor(cssClasses: string[]) {
    this.textE = GenericMessageRenderer.renderText();
    this.rootE = GenericMessageRenderer.renderRoot(cssClasses, this.textE);
    this.hide();
  }

  public static create(cssClasses: string[]): IMessageView {
    return new MessageView(cssClasses);
  }

  protected show(): void {
    this.rootE.style.display = 'block';
  }

  protected hide(): void {
    this.rootE.style.display = 'none';
  }

  public setText(txt: string): void {
    this.textE.innerHTML = txt;
    this.show();
  }

  public clearText(): void {
    this.textE.innerHTML = '';
    this.hide();
  }

  public render(): HTMLElement {
    return this.rootE;
  }

  public reset(): void {
    this.clearText();
  }
}
