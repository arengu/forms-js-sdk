import { IHTMLBlockModel } from "./BlockModel";
import { ICodeBlockPresenter, CodeBlockPresenter } from "./CodeBlockPresenter";

const CONTAINER_CLASS = 'af-html-block';

export type IHTMLBlockPresenter = ICodeBlockPresenter;

export class HTMLBlockPresenter extends CodeBlockPresenter implements IHTMLBlockPresenter {
  protected constructor(blockM: IHTMLBlockModel) {
    super({
      containerClass: CONTAINER_CLASS,
      blockContent: blockM.config.content,
    });
  }

  public static create(buttonM: IHTMLBlockModel): IHTMLBlockPresenter {
    return new HTMLBlockPresenter(buttonM)
  }
}
