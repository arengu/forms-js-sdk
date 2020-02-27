import { IHTMLView } from '../base/view/HTMLView';
import { IBlockModel } from '../block/BlockModel';
import { IFieldModel } from '../field/model/FieldModel';

export type IComponentView = IHTMLView;

export enum ComponentCategory {
  BLOCK = 'BLOCK',
  FIELD = 'FIELD',
}

export type IComponentModel = IFieldModel | IBlockModel;
