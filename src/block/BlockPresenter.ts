import { BlockType, IBlockModel } from "./BlockModel";
import { PreviousButtonPresenter, IPreviousButtonPresenter } from "./navigation/previous/PreviousButtonPresenter";
import { NextButtonPresenter } from "./navigation/next/NextButtonPresenter";
import { IComponentPresenter } from "../component/ComponentPresenter";
import { HTMLBlockPresenter } from "./HtmlBlockPresenter";
import { RichTextBlockPresenter } from "./RichTextBlockPresenter";

export type IBlockPresenter = IComponentPresenter;

export interface IBlockPresenterListener {
  onGoToPrevious?(this: this, buttonP: IPreviousButtonPresenter): void;
}

export const BlockPresenter = {
  create(blockM: IBlockModel): IBlockPresenter {
    switch (blockM.type) {
      case BlockType.PREVIOUS_BUTTON:
        return PreviousButtonPresenter.create(blockM);
      case BlockType.NEXT_BUTTON:
        return NextButtonPresenter.create(blockM);
      case BlockType.HTML:
        return HTMLBlockPresenter.create(blockM);
      case BlockType.RICH_TEXT:
        return RichTextBlockPresenter.create(blockM);
    }
  },
};
