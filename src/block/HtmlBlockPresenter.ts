import { IBlockPresenter } from "./BlockPresenter";
import { BaseComponentPresenter } from "../component/ComponentHelper";
import { IHTMLBlockModel } from "./BlockModel";

export type IHTMLBlockPresenter = IBlockPresenter;

export const HtmlBlockRenderer = {
  renderRoot(content: string): HTMLDivElement {
    const root = document.createElement('div');
    root.className = 'af-html';

    root.innerHTML = content;

    return root;
  },
}

export class HTMLBlockPresenter extends BaseComponentPresenter implements IHTMLBlockPresenter {
  protected rootE: HTMLElement;

  protected constructor(blockM: IHTMLBlockModel) {
    super();
    this.rootE = HtmlBlockRenderer.renderRoot(blockM.config.content);
  }

  public render(): HTMLElement {
    return this.rootE;
  }

  public reset(): void {
    // nothing to do here
  }

  public static create(buttonM: IHTMLBlockModel): IHTMLBlockPresenter {
    return new HTMLBlockPresenter(buttonM)
  }
}
