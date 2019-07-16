import { IHTMLView } from '../../base/view/HTMLView';
import { HTMLHelper } from './HTMLHelper';

export enum ButtonType {
  BUTTON = 'button',
  SUBMIT = 'submit',
}

export interface IButtonCallback {
  (this: void): void;
}

export class GenericButton implements IHTMLView {
  protected text: string;

  protected readonly type: string;

  protected readonly cssClasses: string[];

  protected readonly callback: null | IButtonCallback;

  protected buttonE: null | HTMLElement;

  protected rootE: null | HTMLElement;

  protected constructor(text: string, type: ButtonType,
    callback?: null | IButtonCallback, cssClasses?: string[]) {
    this.text = text;
    this.type = type;
    this.cssClasses = cssClasses || [];

    this.callback = callback || null;

    this.buttonE = null;
    this.rootE = null;
  }

  protected getButton(): HTMLElement {
    if (this.buttonE === null) {
      throw new Error('Render it first');
    }

    return this.buttonE;
  }

  protected renderButton(): HTMLElement {
    if (this.buttonE !== null) {
      return this.buttonE;
    }

    const node = document.createElement('button');
    node.setAttribute('type', this.type);

    const text = document.createElement('span');
    text.classList.add('af-button-text');
    text.innerText = this.text;
    node.appendChild(text);

    if (this.type === 'submit') {
      const ladda = document.createElement('span');
      ladda.classList.add('af-button-ladda');
      node.appendChild(ladda);
    }

    if (this.callback !== null) {
      node.onclick = this.callback;
    }

    this.buttonE = node;
    return this.buttonE;
  }

  public render(): HTMLElement {
    if (this.rootE !== null) {
      return this.rootE;
    }

    const container = document.createElement('div');
    this.cssClasses.forEach(HTMLHelper.addClass(container));
    container.classList.add('af-button');

    const button = this.renderButton();
    container.appendChild(button);

    this.rootE = container;
    return this.rootE;
  }

  public reset(): void { // eslint-disable-line class-methods-use-this
    // nothing to do here
  }
}
