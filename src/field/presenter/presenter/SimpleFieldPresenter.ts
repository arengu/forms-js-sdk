import { IFormDeps } from "../../../form/FormPresenter";
import { IFieldModel, IFieldValue } from "../../model/FieldModel";
import { IInputView } from "../../view/InputView";
import { IValueHandler } from "../handler/ValueHandler";
import { IFieldValidator } from "../validator/FieldValidator";
import { BaseFieldPresenter } from "./BaseFieldPresenter";
import { IFieldPresenter } from "./FieldPresenter";

export class SimpleFieldPresenter extends BaseFieldPresenter {
  private constructor(
    formD: IFormDeps, fieldM: IFieldModel, inputV: IInputView,
    fieldVal: IFieldValidator<IFieldValue>, valueH: IValueHandler<IFieldValue>) {
    super(formD, fieldM, inputV, fieldVal, valueH);
  }

  public static create(formD: IFormDeps, fieldM: IFieldModel, inputV: IInputView,
    fieldVal: IFieldValidator<IFieldValue>, valueH: IValueHandler<IFieldValue>): IFieldPresenter {
    return new SimpleFieldPresenter(formD, fieldM, inputV, fieldVal, valueH);
  }
}
