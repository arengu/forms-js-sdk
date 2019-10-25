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

  protected readonly callback?: IButtonCallback;

  protected buttonE?: HTMLElement;

  protected rootE?: HTMLElement;

  protected constructor(text: string, type: ButtonType,
    callback?: IButtonCallback, cssClasses?: string[]) {
    this.text = text;
    this.type = type;
    this.cssClasses = cssClasses || [];

    this.callback = callback;

    this.buttonE = undefined;
    this.rootE = undefined;
  }

  protected getButton(): HTMLElement {
    if (this.buttonE == undefined) { // eslint-disable-line eqeqeq
      throw new Error('Render it first');
    }

    return this.buttonE;
  }

  protected renderButton(): HTMLElement {
    if (this.buttonE != undefined) { // eslint-disable-line eqeqeq
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

    if (this.callback != undefined) { // eslint-disable-line eqeqeq
      node.onclick = this.callback;
    }

    this.buttonE = node;
    return this.buttonE;
  }

  public render(): HTMLElement {
    if (this.rootE != undefined) { // eslint-disable-line eqeqeq
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
