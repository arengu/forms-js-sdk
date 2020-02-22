import { IComponentPresenter } from "./ComponentTypes";
import { IFieldPresenter } from "../field/presenter/FieldPresenter";

export const ComponentHelper = {
  isFieldPresenter(compP: IComponentPresenter): compP is IFieldPresenter {
    return typeof (compP as IFieldPresenter).getFieldId === 'function';
  }
};
