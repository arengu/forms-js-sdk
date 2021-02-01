import { IDividerBlockModel } from "./BlockModel";
import { ICodeBlockPresenter, CodeBlockPresenter } from "./CodeBlockPresenter";

const CONTAINER_CLASS = 'af-divider-block';

export type IDividerBlockPresenter = ICodeBlockPresenter;

export const DividerBlockPresenter = {
  create(blockM: IDividerBlockModel): IDividerBlockPresenter {
    return new CodeBlockPresenter({
      containerClass: CONTAINER_CLASS,
      blockContent: blockM.config.text,
    });
  },
}
