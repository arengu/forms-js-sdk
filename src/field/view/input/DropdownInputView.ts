import {
  IInputViewListener, IInputView, ISingleOptionValue, IMultiOptionValue,
} from '../InputView';
import LegacyDropdown from './legacy/LegacyDropdown';
import { IDropdownFieldModel } from '../../model/FieldModel';

export abstract class DropdownInputRenderer {
  public static renderInput(fieldM: IDropdownFieldModel,
    inputL: IInputViewListener): LegacyDropdown {
    return LegacyDropdown.create(fieldM, inputL);
  }
}

export type IDropdownInputValue = ISingleOptionValue | IMultiOptionValue;

export type IDropdownInputView = IInputView<IDropdownInputValue>;

export class DropdownInputView implements IDropdownInputView {
  protected readonly inputV: LegacyDropdown;

  protected constructor(fieldM: IDropdownFieldModel, inputL: IInputViewListener) {
    this.inputV = DropdownInputRenderer.renderInput(fieldM, inputL);
  }

  public static create(fieldM: IDropdownFieldModel, inputL: IInputViewListener): DropdownInputView {
    return new this(fieldM, inputL);
  }

  public async getValue(): Promise<IDropdownInputValue> {
    return this.inputV.value;
  }

  public reset(): void { // eslint-disable-line class-methods-use-this
    // nothing to do here until LegacyDropdown supports it
  }

  public render(): HTMLDivElement {
    return this.inputV.render();
  }
}
