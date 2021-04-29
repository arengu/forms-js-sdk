import { IArenguForm, IFormDeps } from "../form/FormPresenter";
import { IMagicResolver } from "../lib/MagicResolver";
import { IHTMLBlockModel } from "./BlockModel";
import { ICodeBlockPresenter, CodeBlockPresenter, ICodeBlockParams } from "./CodeBlockPresenter";
import { HTMLBlockHelper } from "./HTMLBlockHelper";

const CONTAINER_CLASS = 'af-html-block';

export type IHTMLBlockPresenter = ICodeBlockPresenter;

export class HTMLBlockPresenterImpl extends CodeBlockPresenter implements IHTMLBlockPresenter {
  protected readonly formI: IArenguForm;

  public constructor(formI: IArenguForm, params: ICodeBlockParams) {
    super(params);

    this.formI = formI;

    HTMLBlockHelper.reinjectScripts(this.rootE, this.formI);
  }

  public updateContent(resolver: IMagicResolver, everShown: boolean): void {
    super.updateContent(resolver, everShown);

    HTMLBlockHelper.reinjectScripts(this.rootE, this.formI);
  }
}

export const HTMLBlockPresenter = {
  create(formD: IFormDeps, blockM: IHTMLBlockModel): IHTMLBlockPresenter {
    return new HTMLBlockPresenterImpl(
      formD.instance,
      {
        containerClass: CONTAINER_CLASS,
        blockContent: blockM.config.content,
      }
    )
  },
}
