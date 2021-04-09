import { IMagicResolver } from "../lib/MagicResolver";
import { IHTMLBlockModel } from "./BlockModel";
import { ICodeBlockPresenter, CodeBlockPresenter, ICodeBlockParams } from "./CodeBlockPresenter";
import { HTMLBlockHelper } from "./HTMLBlockHelper";

const CONTAINER_CLASS = 'af-html-block';

export type IHTMLBlockPresenter = ICodeBlockPresenter;

export class HTMLBlockPresenterImpl extends CodeBlockPresenter implements IHTMLBlockPresenter {
  public constructor(params: ICodeBlockParams) {
    super(params);

    HTMLBlockHelper.reinjectScripts(this.rootE);
  }

  public updateContent(resolver: IMagicResolver): void {
    super.updateContent(resolver);

    HTMLBlockHelper.reinjectScripts(this.rootE);
  }
}

export const HTMLBlockPresenter = {
  create(blockM: IHTMLBlockModel): IHTMLBlockPresenter {
    return new HTMLBlockPresenterImpl({
      containerClass: CONTAINER_CLASS,
      blockContent: blockM.config.content,
    });
  },
}
