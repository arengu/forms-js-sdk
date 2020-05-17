import { IView } from "../../core/BaseTypes";

export const HintRenderer = {
  renderContent(text: string): HTMLElement {
    /**
     * Old forms may contain plain text instead of HTML, so we have to
     * check it and wrap the content only when needed.
     *
     * An automatic migration to unify behavior is already in progress.
     */
    const isParagraph = text.startsWith('<p>');

    const hintE = document.createElement(isParagraph ? 'div' : 'p');

    hintE.innerHTML = text;

    return hintE;
  },

  renderRoot(hintE: HTMLElement): HTMLDivElement {
    const rootE = document.createElement('div');
    rootE.classList.add('af-field-hint');

    rootE.appendChild(hintE);

    return rootE;
  },
};

export interface IHintView extends IView {
  updateHint(text: string): void;
  reset(): void;
}

export class HintView implements IHintView {
  protected readonly defValue: string;

  protected readonly textE: HTMLElement;

  protected readonly rootE: HTMLDivElement;

  protected constructor(hint: string) {
    this.defValue = hint;
    this.textE = HintRenderer.renderContent(hint);
    this.rootE = HintRenderer.renderRoot(this.textE);
  }

  public static create(hint: string): IHintView {
    return new HintView(hint);
  }

  public updateHint(text: string): void {
    this.textE.innerHTML = text;
  }

  public reset(): void {
    this.updateHint(this.defValue);
  }

  public render(): HTMLElement {
    return this.rootE;
  }
}
