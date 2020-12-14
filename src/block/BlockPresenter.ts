import { BlockType, IBlockModel } from "./BlockModel";
import { PreviousButtonPresenter, IPreviousButtonPresenter } from "./navigation/button/PreviousButton";
import { IComponentPresenter } from "../component/ComponentPresenter";
import { HTMLBlockPresenter } from "./HtmlBlockPresenter";
import { RichTextBlockPresenter } from "./RichTextBlockPresenter";
import { INextButtonPresenter, NextButtonPresenter } from "./navigation/button/NextButton";
import { IJumpButtonPresenter, JumpButtonPresenter } from "./navigation/button/JumpButton";

export type IBlockPresenter = IComponentPresenter;

export interface IBlockPresenterListener {
  onPreviousButton?(this: this, buttonP: IPreviousButtonPresenter): void;
  onNextButton?(this: this, buttonP: INextButtonPresenter): void;
  onJumpButton?(this: this, buttonP: IJumpButtonPresenter): void;
}

export const BlockPresenter = {
  create(blockM: IBlockModel): IBlockPresenter {
    switch (blockM.type) {
      case BlockType.PREVIOUS_BUTTON:
        return PreviousButtonPresenter.create(blockM);
      case BlockType.NEXT_BUTTON:
        return NextButtonPresenter.create(blockM);
      case BlockType.JUMP_BUTTON:
        return JumpButtonPresenter.create(blockM);
      case BlockType.HTML:
        return HTMLBlockPresenter.create(blockM);
      case BlockType.RICH_TEXT:
        return RichTextBlockPresenter.create(blockM);
    }
  },
};
