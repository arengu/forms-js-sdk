import { IComponentPresenter } from "../component/ComponentTypes";
import { BlockType, IBlockModel } from "./BlockModel";
import { PreviousButtonPresenter, IPreviousButtonListener } from "./navigation/previous/PreviousButtonPresenter";
import { NextButtonPresenter } from "./navigation/next/NextButtonPresenter";

export type IBlockListener = IPreviousButtonListener;

export type IBlockPresenter = IComponentPresenter;

export abstract class BlockPresenter {
  public static create(blockM: IBlockModel, blockL: IBlockListener): IBlockPresenter {
    switch (blockM.type) {
      case BlockType.PREVIOUS_BUTTON:
        return PreviousButtonPresenter.create(blockM, blockL);
      case BlockType.NEXT_BUTTON:
        return NextButtonPresenter.create(blockM);
    }
  }
}
