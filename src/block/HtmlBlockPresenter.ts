import { IHTMLBlockModel } from "./BlockModel";
import { ICodeBlockPresenter, CodeBlockPresenter } from "./CodeBlockPresenter";

const CONTAINER_CLASS = 'af-html-block';

export type IHTMLBlockPresenter = ICodeBlockPresenter;

export const HTMLBlockPresenter =  {
  create(blockM: IHTMLBlockModel): IHTMLBlockPresenter {
    return new CodeBlockPresenter({
      containerClass: CONTAINER_CLASS,
      blockContent: blockM.config.content,
    });
  },
}
