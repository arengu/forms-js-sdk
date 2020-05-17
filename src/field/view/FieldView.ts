import isNil from 'lodash/isNil';
import { IFieldModel } from '../model/FieldModel';
import { FieldErrorMessage } from './FieldErrorMessage';
import { IInputView } from './InputView';
import { IHintView, HintView } from './HintView';
import { ILabelView, LabelView } from './LabelView';
import { IComponentView } from '../../component/ComponentModel';

export interface IFieldView extends IComponentView {
  reset(): void;

  updateLabel(label: string): void;
  updateHint(hint: string): void;

  setError(msg: string): void;
  clearError(): void;
}

export const FieldRenderer = {
  renderInput(inputV: IInputView): HTMLDivElement {
    const wrapper = document.createElement('div');
    wrapper.classList.add('af-field-input');

    const inputE = inputV.render();
    wrapper.appendChild(inputE);

    return wrapper;
  },

  renderRoot(fieldM: IFieldModel, inputV: IInputView,
    errorV: FieldErrorMessage, labelV?: ILabelView, hintV?: IHintView): HTMLDivElement {
    const { id } = fieldM;

    const root = document.createElement('div');
    root.classList.add(`af-field-${id}`);
    root.classList.add('af-field');

    if (!isNil(labelV)) {
      root.appendChild(labelV.render());
    }

    if (!isNil(hintV)) {
      root.appendChild(hintV.render());
    }

    const inputE = this.renderInput(inputV);
    root.appendChild(inputE);

    const errorE = errorV.render();
    root.appendChild(errorE);

    return root;
  },
};

export class FieldView implements IFieldView {
  protected readonly labelV?: ILabelView;
  protected readonly hintV?: IHintView;

  protected readonly errorV: FieldErrorMessage;

  protected readonly rootE: HTMLDivElement;

  protected constructor(fieldM: IFieldModel, inputV: IInputView) {
    const uid = inputV.getInputId && inputV.getInputId();

    this.labelV = fieldM.label ? LabelView.create(fieldM.label, fieldM.required, uid) : undefined;
    this.hintV = fieldM.hint ? HintView.create(fieldM.hint) : undefined;

    this.errorV = FieldErrorMessage.create();

    this.rootE = FieldRenderer.renderRoot(fieldM, inputV, this.errorV, this.labelV, this.hintV);
  }

  public static create(fieldM: IFieldModel, inputV: IInputView): IFieldView {
    return new FieldView(fieldM, inputV);
  }

  public updateLabel(label: string): void {
    if (this.labelV) {
      this.labelV.updateLabel(label);
    }
  }

  public updateHint(hint: string): void {
    if (this.hintV) {
      this.hintV.updateHint(hint);
    }
  }

  public reset(): void {
    this.errorV.reset();
  }

  public addErrorFlag(): void {
    this.rootE.classList.add('af-field-has-error');
  }

  public removeErrorFlag(): void {
    this.rootE.classList.remove('af-field-has-error');
  }

  public setError(msg: string): void {
    this.errorV.setText(msg);
    this.addErrorFlag();
  }

  public clearError(): void {
    this.errorV.clearText();
    this.removeErrorFlag();
  }

  public render(): HTMLDivElement {
    return this.rootE;
  }
}
