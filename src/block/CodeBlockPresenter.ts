import { IBlockPresenter } from "./BlockPresenter";
import { BaseBlockPresenter } from "./BaseBlockPresenter";

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
  protected rootE: HTMLElement;

  protected constructor(params: ICodeBlockParams) {
    super();
    this.rootE = CodeBlockRenderer.renderRoot(params);
  }

  public render(): HTMLElement {
    return this.rootE;
  }

  public reset(): void {
    // nothing to do here
  }
}
