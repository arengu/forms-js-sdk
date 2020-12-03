import { IJumpButtonPresenter, JumpButtonPresenter } from "../block/navigation/jump/JumpButtonPresenter";
import { INextButtonPresenter, NextButtonPresenter } from "../block/navigation/next/NextButtonPresenter";
import { IFieldPresenter } from "../field/presenter/presenter/FieldPresenter";
import { IComponentPresenter } from "./ComponentPresenter";

export type IForwardButtonPresenter = INextButtonPresenter | IJumpButtonPresenter;

export const ComponentHelper = {
  isFieldPresenter(compP: IComponentPresenter): compP is IFieldPresenter {
    return typeof (compP as IFieldPresenter).getFieldId === 'function';
  },

  isForwardButton(compP: IComponentPresenter): compP is IForwardButtonPresenter {
    return NextButtonPresenter.matches(compP) || JumpButtonPresenter.matches(compP);
  },
};
