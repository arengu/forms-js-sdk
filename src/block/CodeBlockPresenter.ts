import escapeHE from 'lodash/escape';

import { IBlockPresenter } from "./BlockPresenter";
import { BaseBlockPresenter } from "../core/BasePresenters";

import { MagicString } from "../lib/MagicString";
import { IRefScope } from '../form/model/FormModel';

export type ICodeBlockPresenter = IBlockPresenter;

export interface ICodeBlockParams {
  readonly containerClass: string;
  readonly blockContent: string;
}

export const CodeBlockRenderer = {
  renderRoot(params: ICodeBlockParams): HTMLDivElement {
    const root = document.createElement('div');
    root.className = params.containerClass;

    root.innerHTML = params.blockContent;

    return root;
  },
}

export class CodeBlockPresenter extends BaseBlockPresenter implements ICodeBlockPresenter {
  protected content: string;
  protected rootE: HTMLElement;

  public constructor(params: ICodeBlockParams) {
    super();

    this.content = params.blockContent;

    this.rootE = CodeBlockRenderer.renderRoot(params);
  }

  public render(): HTMLElement {
    return this.rootE;
  }

  public reset(): void {
    // nothing to do here
  }

  public isDynamic(this: this): boolean {
    return MagicString.isDynamic(this.content);
  }

  public updateContent(this: this, data: IRefScope): void {
    this.rootE.innerHTML = MagicString.render(this.content, data, escapeHE);
  }
}
