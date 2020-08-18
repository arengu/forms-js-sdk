import escapeHE from 'lodash/escape';

import { IRichTextBlockModel } from "./BlockModel";
import { ICodeBlockPresenter, CodeBlockPresenter } from "./CodeBlockPresenter";
import { MagicString } from "../lib/MagicString";
import { IRefScope } from '../form/model/FormModel';

const CONTAINER_CLASS = 'af-rich-text-block';

export type IRichTextBlockPresenter = ICodeBlockPresenter;

export class RichTextBlockPresenter extends CodeBlockPresenter implements IRichTextBlockPresenter {
  protected content: string;

  protected constructor(blockM: IRichTextBlockModel) {
    super({
      containerClass: CONTAINER_CLASS,
      blockContent: blockM.config.content,
    });

    this.content = blockM.config.content;
  }

  public static create(blockM: IRichTextBlockModel): IRichTextBlockPresenter {
    return new RichTextBlockPresenter(blockM);
  }

  public isDynamic(this: this): boolean {
    return MagicString.isDynamic(this.content);
  }

  public updateContent(this: this, data: IRefScope): void {
    this.rootE.innerHTML = MagicString.render(this.content, data, escapeHE);
  }
}
