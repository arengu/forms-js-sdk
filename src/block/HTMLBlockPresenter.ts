import { IArenguForm, IFormDeps } from "../form/FormPresenter";
import { IMagicResolver } from "../lib/MagicResolver";
import { IHTMLBlockModel } from "./BlockModel";
import { ICodeBlockPresenter, CodeBlockPresenter, ICodeBlockParams } from "./CodeBlockPresenter";
import { HTMLBlockHelper } from "./HTMLBlockHelper";

const CONTAINER_CLASS = 'af-html-block';

export type IHTMLBlockPresenter = ICodeBlockPresenter;

export interface IHTMLBlockParams extends ICodeBlockParams {
  readonly disableScripts: boolean;
}

export class HTMLBlockPresenterImpl extends CodeBlockPresenter implements IHTMLBlockPresenter {
  protected readonly formI: IArenguForm;
  protected readonly formE: HTMLElement;
  protected readonly disableScripts: boolean;

  public constructor(formI: IArenguForm, formE: HTMLElement, params: IHTMLBlockParams) {
    super(params);

    this.formI = formI;
    this.formE = formE;
    this.disableScripts = params.disableScripts;

    this.handleScripts();
  }

  public updateContent(resolver: IMagicResolver, everShown: boolean): void {
    super.updateContent(resolver, everShown);

    this.handleScripts();
  }

  private handleScripts(): void {
    if (this.disableScripts) {
      HTMLBlockHelper.disableScripts(this.rootE);
    } else {
      HTMLBlockHelper.reinjectScripts(this.rootE, this.formI, this.formE);
    }
  }
}

export const HTMLBlockPresenter = {
  create(formD: IFormDeps, blockM: IHTMLBlockModel): IHTMLBlockPresenter {
    return new HTMLBlockPresenterImpl(
      formD.instance,
      formD.root,
      {
        containerClass: CONTAINER_CLASS,
        blockContent: blockM.config.content || '',
        disableScripts: formD.options.disableScripts || false,
      }
    )
  },
}
