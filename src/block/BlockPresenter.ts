import { BlockType, IBlockModel } from "./BlockModel";
import { PreviousButtonPresenter, IPreviousButtonPresenter } from "./navigation/button/PreviousButton";
import { IComponentPresenter } from "../component/ComponentPresenter";
import { HTMLBlockPresenter } from "./HtmlBlockPresenter";
import { RichTextBlockPresenter } from "./RichTextBlockPresenter";
import { IAsyncButtonPresenter } from "./navigation/button/async/AsyncButtonPresenter";
import { ForwardButtonFactory } from "./navigation/forward/ForwardButtonFactory";

export type IBlockPresenter = IComponentPresenter;

export interface IBlockPresenterListener {
  onGoToPrevious?(this: this, buttonP: IPreviousButtonPresenter): void;
  onGoForward?(this: this, buttonP: IAsyncButtonPresenter): void;
}

export const BlockPresenter = {
  create(blockM: IBlockModel): IBlockPresenter {
    switch (blockM.type) {
      case BlockType.PREVIOUS_BUTTON:
        return PreviousButtonPresenter.create(blockM);
      case BlockType.NEXT_BUTTON:
        return ForwardButtonFactory.fromNextButton(blockM);
      case BlockType.JUMP_BUTTON:
        return ForwardButtonFactory.fromJumpButton(blockM);
      case BlockType.HTML:
        return HTMLBlockPresenter.create(blockM);
      case BlockType.RICH_TEXT:
        return RichTextBlockPresenter.create(blockM);
    }
  },
};
