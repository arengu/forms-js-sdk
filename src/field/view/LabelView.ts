import escape from 'lodash/escape';

import { IView } from "../../core/BaseTypes";

export const LabelRenderer = {
  renderLabel(text: string, required?: boolean, uid?: string): HTMLLabelElement {
    const node = document.createElement('label');
    node.innerHTML = text;

    if (uid) {
      node.setAttribute('for', uid);
    }

    if (required) {
      node.classList.add('af-required');
    }

    return node;
  },

  renderRoot(labelE: HTMLLabelElement): HTMLDivElement {
    const wrapperContainer = document.createElement('div');
    wrapperContainer.classList.add('af-field-label');

    wrapperContainer.appendChild(labelE);

    return wrapperContainer;
  },
};

export interface ILabelView extends IView {
  updateLabel(text: string): void;
  reset(): void;
}

export class LabelView implements ILabelView {
  protected readonly defValue: string;

  protected readonly textE: HTMLLabelElement;

  protected readonly rootE: HTMLDivElement;

  protected constructor(label: string, required?: boolean, uid?: string) {
    this.defValue = label;
    this.textE = LabelRenderer.renderLabel(label, required, uid);
    this.rootE = LabelRenderer.renderRoot(this.textE);
  }

  public static create(label: string, required?: boolean, uid?: string): ILabelView | undefined {
    return new LabelView(label, required, uid);
  }

  public updateLabel(text: string): void {
    const escText = escape(text);
    this.textE.innerHTML = escText;
  }

  public reset(): void {
    this.updateLabel(this.defValue);
  }

  public render(): HTMLElement {
    return this.rootE;
  }
}
