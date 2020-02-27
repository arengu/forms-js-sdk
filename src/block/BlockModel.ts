import { ComponentCategory } from "../component/ComponentModel";

export enum BlockType {
  PREVIOUS_BUTTON = 'PREVIOUS_BUTTON',
  NEXT_BUTTON = 'NEXT_BUTTON',
}

interface IBaseBlockModel {
  readonly category: ComponentCategory.BLOCK;
  readonly type: BlockType;
  readonly config: object;
}

export interface IPreviousButtonBlockModel extends IBaseBlockModel {
  readonly type: BlockType.PREVIOUS_BUTTON;
  readonly config: {
    readonly text: string;
  };
}

export interface INextButtonBlockModel extends IBaseBlockModel {
  readonly type: BlockType.NEXT_BUTTON;
  readonly config: {
    readonly text: string;
  };
}

export type IBlockModel = IPreviousButtonBlockModel | INextButtonBlockModel;
