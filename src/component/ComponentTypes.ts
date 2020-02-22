import { IHTMLView } from '../base/view/HTMLView';
import { IFieldModel } from '../field/model/FieldModel';
import { IBlockModel } from '../block/BlockModel';
import { IPresenter } from '../base/Presenter';

export type IComponentView = IHTMLView;

export type IComponentPresenter = IPresenter<IComponentView>;

export enum ComponentCategory {
  BLOCK = 'BLOCK',
  FIELD = 'FIELD',
}

export type IComponentModel = IFieldModel | IBlockModel;
