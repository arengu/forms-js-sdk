import escapeHE from 'lodash/escape';

import { IBlockPresenter } from "./BlockPresenter";
import { BaseBlockPresenter } from "../core/BasePresenters";

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
  protected source: string;
  protected rootE: HTMLElement;

  public constructor(params: ICodeBlockParams) {
    super();

    this.source = params.blockContent;

    this.rootE = CodeBlockRenderer.renderRoot(params);
  }

  public render(): HTMLElement {
    return this.rootE;
  }

  public reset(): void {
    // nothing to do here
  }

  public updateContent(resolver: IMagicResolver, everShown: boolean): void {
    // on subsequent calls skip rendering unless there are references inside
    if(everShown && !resolver.isDynamic(this.source)) {
      return;
    }

    this.rootE.innerHTML = resolver.resolve(this.source, escapeHE);
  }
}
