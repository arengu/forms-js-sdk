import { IRichTextBlockModel } from "./BlockModel";
import { ICodeBlockPresenter, CodeBlockPresenter } from "./CodeBlockPresenter";

const CONTAINER_CLASS = 'af-rich-text-block';

export type IRichTextBlockPresenter = ICodeBlockPresenter;

export class RichTextBlockPresenter extends CodeBlockPresenter implements IRichTextBlockPresenter {
  protected constructor(blockM: IRichTextBlockModel) {
    super({
      containerClass: CONTAINER_CLASS,
      blockContent: blockM.config.content,
    });
  }

  public static create(buttonM: IRichTextBlockModel): IRichTextBlockPresenter {
    return new RichTextBlockPresenter(buttonM)
  }
}
