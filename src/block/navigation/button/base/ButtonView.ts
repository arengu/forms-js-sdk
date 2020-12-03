import { IView } from "../../../../core/BaseTypes";
import { HTMLHelper } from '../../../../lib/view/HTMLHelper';

export interface IButtonViewSubscriber {
  onClick?(): void;
}

export interface IButtonView<S extends IButtonViewSubscriber = IButtonViewSubscriber> extends IView {
  reset(): void;
  block(): void;
  unblock(): void;
  subscribe(subscriber: S): void;
}

export interface IButtonStyle {
  backgroundColor?: string;
}

interface IButtonOptions {
  text: string;
  style?: IButtonStyle;
}

interface IContainerOptions {
  classes?: string[];
}

export interface IButtonViewOptions {
  button: IButtonOptions;
  container: IContainerOptions;
}

export const ButtonRenderer = {
  renderButton(options: IButtonOptions): HTMLButtonElement {
    const button = document.createElement('button');
    button.setAttribute('type', 'button');

    const text = document.createElement('span');
    text.classList.add('af-button-text');
    text.textContent = options.text;
    button.appendChild(text);

    ButtonRenderer.applyStyle(button, options.style)

    return button;
  },

  applyStyle(buttonE: HTMLButtonElement, style?: IButtonStyle): void {
    if (!style) {
      return;
    }

    buttonE.style.backgroundColor = style.backgroundColor ?? '';
  },

  renderContainer(options: IContainerOptions, button: HTMLButtonElement): HTMLDivElement {
    const container = document.createElement('div');

    if (options.classes) {
      options.classes.forEach(HTMLHelper.addClass(container));
    }

    container.classList.add('af-button');

    container.appendChild(button);

    return container;
  },
}

export class ButtonViewImpl<S extends IButtonViewSubscriber = IButtonViewSubscriber> implements IButtonView<S> {
  protected readonly buttonE: HTMLButtonElement;
  protected readonly rootE: HTMLDivElement;

  protected readonly subscribers: S[];

  public constructor(options: IButtonViewOptions) {
    this.buttonE = ButtonRenderer.renderButton(options.button);
    this.rootE = ButtonRenderer.renderContainer(options.container, this.buttonE);

    this.subscribers = [];
    this.buttonE.onclick = this.onClick.bind(this);
  }

  public render(): HTMLElement {
    return this.rootE;
  }

  public onClick(): void {
    this.subscribers.forEach((sub) => sub.onClick?.());
  }

  public subscribe(subscriber: S): void {
    this.subscribers.push(subscriber)
  }

  public block(): void {
    this.buttonE.disabled = true;
  }

  public unblock(): void {
    this.buttonE.disabled = false;
  }

  public reset(): void {
    // nothing to do here
  }
}

export const ButtonView = {
  create(options: IButtonViewOptions): IButtonView {
    return new ButtonViewImpl(options);
  },
}
