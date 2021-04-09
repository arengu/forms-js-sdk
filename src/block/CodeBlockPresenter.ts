import escapeHE from 'lodash/escape';

import { IBlockPresenter } from "./BlockPresenter";
import { BaseBlockPresenter } from "../core/BasePresenters";

import { RefResolver } from '../lib/RefResolver';
import { IMagicResolver } from '../lib/MagicResolver';

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

  public updateContent(resolver: IMagicResolver): void {
    this.rootE.innerHTML = resolver.resolve(this.content, escapeHE);
  }
}
