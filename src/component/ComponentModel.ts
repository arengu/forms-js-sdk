import { IView } from "../core/BaseTypes";
import { IBlockModel } from '../block/BlockModel';
import { IFieldModel } from '../field/model/FieldModel';

export type IComponentView = IView;

export enum ComponentCategory {
  BLOCK = 'BLOCK',
  FIELD = 'FIELD',
}

export type IComponentModel = IFieldModel | IBlockModel;
