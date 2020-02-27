import isNil from 'lodash/isNil';

import { IHTMLView } from '../../base/view/HTMLView';
import { HTMLHelper } from '../../lib/view/HTMLHelper';

export enum ButtonType {
  BUTTON = 'button',
  SUBMIT = 'submit',
}

enum ButtonStatus {
  ENABLED = 'ENABLED',
  DISABLED = 'DISABLED',
}

export interface IButtonCallback {
  (this: void): void;
}

export interface IGenericButtonView extends IHTMLView {
  showLoading(): void;
  hideLoading(): void;
  block(): void;
  unblock(): void;
}

interface IButtonOptions {
  text: string;
  type: ButtonType;
  callback?: IButtonCallback;
  initStatus?: ButtonStatus;
}

interface IContainerOptions {
  containerClasses?: string[];
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

    if (options.initStatus === ButtonStatus.DISABLED) {
      button.disabled = true;
    }

    const ladda = document.createElement('span');
    ladda.classList.add('af-button-ladda');
    button.appendChild(ladda);

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
  },

  renderLadda(buttonE: HTMLButtonElement): HTMLSpanElement {
    const ladda = document.createElement('span');
    ladda.classList.add('af-button-ladda');
    buttonE.appendChild(ladda);

    return ladda;
  }
}

export class GenericButtonView implements IGenericButtonView {
  protected readonly buttonE: HTMLButtonElement;
  protected laddaE?: HTMLSpanElement;
  protected readonly rootE: HTMLDivElement;

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

  public block(): void {
    this.buttonE.disabled = true;
  }

  public unblock(): void {
    this.buttonE.disabled = false;
  }

  public reset(): void {
    this.hideLoading();
    this.unblock();
  }
}
