import { IFieldPresenter } from "../field/presenter/presenter/FieldPresenter";
import { IComponentPresenter } from "./ComponentPresenter";

export const ComponentHelper = {
  isFieldPresenter(compP: IComponentPresenter): compP is IFieldPresenter {
    return typeof (compP as IFieldPresenter).getFieldId === 'function';
  },
};
