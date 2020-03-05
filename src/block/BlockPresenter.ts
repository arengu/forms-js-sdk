import { BlockType, IBlockModel } from "./BlockModel";
import { PreviousButtonPresenter, IPreviousButtonPresenter } from "./navigation/previous/PreviousButtonPresenter";
import { NextButtonPresenter } from "./navigation/next/NextButtonPresenter";
import { IComponentPresenter } from "../component/ComponentPresenter";
import { BaseComponentPresenter } from "../component/ComponentHelper";
import { HTMLBlockPresenter } from "./HtmlBlockPresenter";

export type IBlockPresenter = IComponentPresenter;

export class BaseBlockPresenter extends BaseComponentPresenter { }

export interface IBlockPresenterListener {
  onGoToPrevious?(this: this, buttonP: IPreviousButtonPresenter): void;
}

export abstract class BlockPresenter {
  public static create(blockM: IBlockModel): IBlockPresenter {
    switch (blockM.type) {
      case BlockType.PREVIOUS_BUTTON:
        return PreviousButtonPresenter.create(blockM);
      case BlockType.NEXT_BUTTON:
        return NextButtonPresenter.create(blockM);
      case BlockType.HTML:
        return HTMLBlockPresenter.create(blockM);
    }
  }
}
