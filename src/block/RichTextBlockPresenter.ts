import { IRichTextBlockModel } from "./BlockModel";
import { ICodeBlockPresenter, CodeBlockPresenter } from "./CodeBlockPresenter";

const CONTAINER_CLASS = 'af-rich-text-block';

export type IRichTextBlockPresenter = ICodeBlockPresenter;

export const RichTextBlockPresenter = {
  create(blockM: IRichTextBlockModel): IRichTextBlockPresenter {
    return new CodeBlockPresenter({
      containerClass: CONTAINER_CLASS,
      blockContent: blockM.config.content,
    });
  },
}
