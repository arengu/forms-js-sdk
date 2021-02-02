import { BaseBlockPresenter } from "../core/BasePresenters";
import { HTMLHelper } from "../lib/view/HTMLHelper";
import { IDividerBlockModel } from "./BlockModel";
import { IBlockPresenter } from "./BlockPresenter";

const CONTAINER_CLASS = 'af-divider-block';

export type IDividerBlockPresenter = IBlockPresenter;

export interface IDividerParams {
  readonly containerClass: string;
  readonly text: string;
}

export const DividerRenderer = {
  renderRoot(params: IDividerParams): HTMLDivElement {
    const root = document.createElement('div');
    root.className = params.containerClass;

    const p = document.createElement('p');

    if (params.text) {
      const span = document.createElement('span');
      span.innerText = params.text;
      p.append(span);
    }

    root.append(p);

    return root;
  },
}

export class DividerBlockPresenterImpl extends BaseBlockPresenter {
  protected text: string;
  protected rootE: HTMLElement;

  public constructor(params: IDividerParams) {
    super();

    this.text = params.text;
    this.rootE = DividerRenderer.renderRoot(params);
  }

  public render(): HTMLElement {
    return this.rootE;
  }
}

export const DividerBlockPresenter = {
  create(blockM: IDividerBlockModel): IDividerBlockPresenter {
    const text = blockM.config.text || '';

    return new DividerBlockPresenterImpl({
      containerClass: CONTAINER_CLASS,
      text,
    });
  }
}
