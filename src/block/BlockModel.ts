import { ComponentCategory } from "../component/ComponentModel";

export enum BlockType {
  PREVIOUS_BUTTON = 'PREVIOUS_BUTTON',
  NEXT_BUTTON = 'NEXT_BUTTON',
  JUMP_BUTTON = 'JUMP_BUTTON',
  HTML = 'HTML',
  RICH_TEXT = 'RICH_TEXT',
  DIVIDER = 'DIVIDER',
}

interface IBaseBlockModel {
  readonly category: ComponentCategory.BLOCK;
  readonly type: BlockType;
  readonly id?: string;
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

export interface IJumpButtonBlockModel extends IBaseBlockModel {
  readonly type: BlockType.JUMP_BUTTON;
  readonly config: {
    readonly text: string;
    readonly style: {
      readonly backgroundColor?: string;
    };
  };
}

export interface IHTMLBlockModel extends IBaseBlockModel {
  readonly type: BlockType.HTML;
  readonly config: {
    readonly content?: string;
  };
}

export interface IRichTextBlockModel extends IBaseBlockModel {
  readonly type: BlockType.RICH_TEXT;
  readonly config: {
    readonly content?: string;
  };
}

export interface IDividerBlockModel extends IBaseBlockModel {
  readonly type: BlockType.DIVIDER;
  readonly config: {
    readonly text?: string;
  };
}

export type IBlockModel = IPreviousButtonBlockModel | INextButtonBlockModel | IJumpButtonBlockModel
  | IHTMLBlockModel | IRichTextBlockModel | IDividerBlockModel;
