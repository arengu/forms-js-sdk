import {
  IInputView, ISingleOptionValue, IMultiOptionValue, IHTMLInputListener, BaseInputView,
} from '../InputView';
import LegacyDropdown from './legacy/LegacyDropdown';
import { IDropdownFieldModel } from '../../model/FieldModel';

export const DropdownInputRenderer = {
  renderInput(fieldM: IDropdownFieldModel,
    inputL: IHTMLInputListener): LegacyDropdown {
    return LegacyDropdown.create(fieldM, inputL);
  },
};

export type IDropdownInputValue = ISingleOptionValue | IMultiOptionValue;

export interface IDropdownInputView extends IInputView {
  getValue(): IDropdownInputValue;
}

export class DropdownInputView extends BaseInputView implements IDropdownInputView {
  protected readonly inputV: LegacyDropdown;

  protected constructor(fieldM: IDropdownFieldModel) {
    super();

    this.inputV = DropdownInputRenderer.renderInput(fieldM, this);
  }

  public static create(fieldM: IDropdownFieldModel): IDropdownInputView {
    return new this(fieldM);
  }

  public getValue(): IDropdownInputValue {
    return this.inputV.value;
  }

  public reset(): void {
    // nothing to do here until LegacyDropdown supports it
  }

  public block(): void {
    // nothing to do here until LegacyDropdown supports it
  }

  public unblock(): void {
    // nothing to do here until LegacyDropdown supports it
  }

  public render(): HTMLDivElement {
    return this.inputV.render();
  }
}
