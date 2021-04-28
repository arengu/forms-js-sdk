import { BlockPresenter, IBlockPresenterListener } from '../block/BlockPresenter';
import { FieldPresenter, IFieldPresenterListener } from '../field/presenter/presenter/FieldPresenter';
import { IFormDeps } from '../form/FormPresenter';
import { IListenableEntity } from '../lib/ListenableEntity';
import { ComponentCategory, IComponentModel } from './ComponentModel';
import { IPresenter } from '../core/BaseTypes';
import { IMagicResolver } from '../lib/MagicResolver';

export interface IComponentPresenterListener extends IFieldPresenterListener, IBlockPresenterListener { }

export interface IComponentPresenter extends IPresenter, IListenableEntity<IComponentPresenterListener> {
  unblock?(): void;
  block?(): void;

  onShow?(): void;
  onHide?(): void;

  updateContent(this: this, resolver: IMagicResolver, everShown: boolean): void;
}

export const ComponentPresenter = {
  create(formD: IFormDeps, compM: IComponentModel): IComponentPresenter {
    switch (compM.category) {
      case ComponentCategory.FIELD:
        return FieldPresenter.create(formD, compM);
      case ComponentCategory.BLOCK:
        return BlockPresenter.create(formD, compM);
    }
  },
}
