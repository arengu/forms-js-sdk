import isNil from 'lodash/isNil';

import { IHTMLView } from '../../base/view/HTMLView';
import { HTMLHelper } from '../../lib/view/HTMLHelper';

export enum ButtonType {
  BUTTON = 'button',
  SUBMIT = 'submit',
}

export interface IButtonCallback {
  (this: void): void;
}

export interface IGenericButtonView extends IHTMLView {
  showLoading(): void;
  hideLoading(): void;
  enable(): void;
  disable(): void;
}

export interface IGenericButtonOptions extends IButtonOptions, IContainerOptions { }

export const GenericButtonRenderer = {
  renderButton(options: IButtonOptions): HTMLButtonElement {
    const button = document.createElement('button');
    button.setAttribute('type', options.type);

    const text = document.createElement('span');
    text.classList.add('af-button-text');
    text.textContent = options.text;
    button.appendChild(text);

    if (options.type === 'submit') {
      const ladda = document.createElement('span');
      ladda.classList.add('af-button-ladda');
      button.appendChild(ladda);
    }

    if (!isNil(options.callback)) {
      button.onclick = options.callback;
    }

    return button;
  },

  renderContainer(options: IContainerOptions, button: HTMLButtonElement): HTMLDivElement {
    const container = document.createElement('div');

    if (options.containerClasses) {
      options.containerClasses.forEach(HTMLHelper.addClass(container));
    }

    container.classList.add('af-button');

    container.appendChild(button);

    return container;
  }
}

interface IButtonOptions {
  text: string;
  type: ButtonType;
  callback?: IButtonCallback;
}

interface IContainerOptions {
  containerClasses?: string[];
}

export class GenericButtonView implements IGenericButtonView {
  protected buttonE: HTMLButtonElement;

  protected rootE: HTMLDivElement;

  protected constructor(options: IGenericButtonOptions) {
    this.buttonE = GenericButtonRenderer.renderButton(options);
    this.rootE = GenericButtonRenderer.renderContainer(options, this.buttonE);
  }

  public render(): HTMLElement {
    return this.rootE;
  }

  public showLoading(): void {
    this.buttonE.classList.add('af-button-loading');
  }

  public hideLoading(): void {
    this.buttonE.classList.remove('af-button-loading');
  }

  public enable(): void {
    this.buttonE.removeAttribute('disabled');
  }

  public disable(): void {
    this.buttonE.setAttribute('disabled', 'true');
  }

  public reset(): void {
    this.hideLoading();
    this.enable();
  }
}
