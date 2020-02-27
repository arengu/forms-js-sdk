import { IFieldPresenter } from "../field/presenter/presenter/FieldPresenter";
import { ListenableEntity } from "../lib/ListenableEntity";
import { IComponentPresenter, IComponentPresenterListener } from "./ComponentPresenter";

export const ComponentHelper = {
  isFieldPresenter(compP: IComponentPresenter): compP is IFieldPresenter {
    return typeof (compP as IFieldPresenter).getFieldId === 'function';
  }
};

export abstract class BaseComponentPresenter extends ListenableEntity<IComponentPresenterListener> { }
