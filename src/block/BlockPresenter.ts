import { BlockType, IBlockModel } from "./BlockModel";
import { PreviousButtonPresenter, IPreviousButtonPresenter } from "./navigation/button/PreviousButton";
import { IComponentPresenter } from "../component/ComponentPresenter";
import { HTMLBlockPresenter } from "./HTMLBlockPresenter";
import { RichTextBlockPresenter } from "./RichTextBlockPresenter";
import { DividerBlockPresenter } from "./DividerBlockPresenter";
import { INextButtonPresenter, NextButtonPresenter } from "./navigation/button/NextButton";
import { IJumpButtonPresenter, JumpButtonPresenter } from "./navigation/button/JumpButton";
import { IFormDeps } from "../form/FormPresenter";

export type IBlockPresenter = IComponentPresenter;

export interface IBlockPresenterListener {
  onPreviousButton?(this: this, buttonP: IPreviousButtonPresenter): void;
  onNextButton?(this: this, buttonP: INextButtonPresenter): void;
  onJumpButton?(this: this, buttonP: IJumpButtonPresenter): void;
}

export const BlockPresenter = {
  create(formD: IFormDeps, blockM: IBlockModel): IBlockPresenter {
    switch (blockM.type) {
      case BlockType.PREVIOUS_BUTTON:
        return PreviousButtonPresenter.create(blockM);
      case BlockType.NEXT_BUTTON:
        return NextButtonPresenter.create(blockM);
      case BlockType.JUMP_BUTTON:
        return JumpButtonPresenter.create(blockM);
      case BlockType.HTML:
        return HTMLBlockPresenter.create(formD, blockM);
      case BlockType.RICH_TEXT:
        return RichTextBlockPresenter.create(blockM);
      case BlockType.DIVIDER:
        return DividerBlockPresenter.create(blockM);
    }
  },
};
