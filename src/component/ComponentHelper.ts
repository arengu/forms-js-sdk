import { IForwardButtonPresenter, ForwardButtonPresenterImpl } from "../block/navigation/button/forward/ForwardButton";
import { IFieldPresenter } from "../field/presenter/presenter/FieldPresenter";
import { IComponentPresenter } from "./ComponentPresenter";

export const ComponentHelper = {
  isFieldPresenter(compP: IComponentPresenter): compP is IFieldPresenter {
    return typeof (compP as IFieldPresenter).getFieldId === 'function';
  },

  isForwardButton(compP: IComponentPresenter): compP is IForwardButtonPresenter {
    return compP instanceof ForwardButtonPresenterImpl;
  },
};
