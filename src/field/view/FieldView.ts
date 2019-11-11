import isNil from 'lodash/isNil';

import { IComponentView } from '../../component/ComponentView';
import { IInputViewListener, IInputView, IInputValue } from './InputView';
import { IBooleanInputView, IBooleanInputValue } from './input/BooleanInputView';
import { IChoiceInputView, IChoiceInputValue } from './input/ChoiceInputView';
import { IDateInputView, IDateInputValue } from './input/DateInputView';
import { IDropdownInputView, IDropdownInputValue } from './input/DropdownInputView';
import { IEmailInputView, IEmailInputValue } from './input/EmailInputView';
import { ILegalInputView, ILegalInputValue } from './input/LegalInputView';
import { INumberInputView, INumberInputValue } from './input/NumberInputView';
import { IPasswordInputView, IPasswordInputValue } from './input/PasswordInputView';
import { IPaymentInputView, IPaymentInputValue } from './input/PaymentInputView';
import { ITelInputView, ITelInputValue } from './input/TelInputView';
import { ITextInputView, ITextInputValue } from './input/TextInputView';
import { IURLInputView, IURLInputValue } from './input/URLInputView';
import { FieldErrorMessage } from './FieldErrorMessage';
import { UID } from '../../lib/UID';
import { IFieldModel } from '../model/FieldModel';
import { ILabelView, LabelView } from './LabelView';

export type IFieldViewListener = IInputViewListener;

export interface IFieldView<IV extends IInputView<IVA>,
  IVA extends IInputValue> extends IComponentView {
  updateLabel(label: string): void;

  getInput(): IV;
  getValue(): Promise<IVA>;

  setError(msg: string): void;
  clearError(): void;
}

export type IAnyFieldView = IFieldView<IInputView<IInputValue>, IInputValue>;

export type IBooleanFieldView = IFieldView<IBooleanInputView, IBooleanInputValue>;
export type IChoiceFieldView = IFieldView<IChoiceInputView, IChoiceInputValue>;
export type IDateFieldView = IFieldView<IDateInputView, IDateInputValue>;
export type IDropdownFieldView = IFieldView<IDropdownInputView, IDropdownInputValue>;
export type IEmailFieldView = IFieldView<IEmailInputView, IEmailInputValue>;
export type ILegalFieldView = IFieldView<ILegalInputView, ILegalInputValue>;
export type INumberFieldView = IFieldView<INumberInputView, INumberInputValue>;
export type IPasswordFieldView = IFieldView<IPasswordInputView, IPasswordInputValue>;
export type IPaymentFieldView = IFieldView<IPaymentInputView, IPaymentInputValue>;
export type ITelFieldView = IFieldView<ITelInputView, ITelInputValue>;
export type ITextFieldView = IFieldView<ITextInputView, ITextInputValue>;
export type IURLFieldView = IFieldView<IURLInputView, IURLInputValue>;

export abstract class FieldRenderer {
  public static renderHint(fieldM: IFieldModel): HTMLElement | undefined {
    const { hint } = fieldM;

    if (!hint) {
      return undefined;
    }

    const wrapper = document.createElement('div');
    wrapper.classList.add('af-field-hint');

    const node = document.createElement('p');
    node.innerHTML = hint;
    wrapper.appendChild(node);

    return wrapper;
  }

  public static renderInput(inputV: IInputView<IInputValue>): HTMLDivElement {
    const wrapper = document.createElement('div');
    wrapper.classList.add('af-field-input');

    const inputE = inputV.render();
    wrapper.appendChild(inputE);

    return wrapper;
  }

  public static renderRoot(fieldM: IFieldModel, uid: string,
    inputV: IInputView<IInputValue>, errorV: FieldErrorMessage,
    labelV?: ILabelView): HTMLDivElement {
    const { id } = fieldM;

    const root = document.createElement('div');
    root.classList.add(`af-field-${id}`);
    root.classList.add('af-field');

    if (!isNil(labelV)) {
      root.appendChild(labelV.render());
    }

    const hintE = this.renderHint(fieldM);
    if (hintE) {
      root.appendChild(hintE);
    }

    const inputE = this.renderInput(inputV);
    root.appendChild(inputE);

    const errorE = errorV.render();
    root.appendChild(errorE);

    return root;
  }
}

export interface IInputFactory<FM extends IFieldModel,
  IV extends IInputView<IInputValue>> {
  createInputView(fieldM: FM, inputL: IInputViewListener, uid: string): IV;
}

export interface IFieldViewDeps<FM extends IFieldModel,
  IV extends IInputView<IInputValue>> {
  readonly fieldM: FM;
  readonly fieldL: IFieldViewListener;
  readonly fieldF: IInputFactory<FM, IV>;
}

export class FieldView<FM extends IFieldModel,
  IV extends IInputView<IVA>, IVA extends IInputValue> implements IFieldView<IV, IVA> {
  protected readonly uid: string;

  protected readonly labelV?: ILabelView;

  protected readonly inputV: IV;

  protected readonly errorV: FieldErrorMessage;

  protected readonly rootE: HTMLDivElement;

  protected constructor(deps: IFieldViewDeps<FM, IV>) {
    this.uid = UID.create();

    this.labelV = LabelView.create(deps.fieldM, this.uid);
    this.inputV = deps.fieldF.createInputView(deps.fieldM, deps.fieldL, this.uid);
    this.errorV = FieldErrorMessage.create();

    this.rootE = FieldRenderer.renderRoot(
      deps.fieldM, this.uid, this.inputV, this.errorV, this.labelV,
    );
  }

  public static create<FM extends IFieldModel,
    IV extends IInputView<IVA>, IVA extends IInputValue>(
      deps: IFieldViewDeps<FM, IV>,
  ): IFieldView<IV, IVA> {
    return new this(deps);
  }

  public updateLabel(label: string): void {
    if (this.labelV) {
      this.labelV.updateLabel(label);
    }
  }

  public getInput(): IV {
    return this.inputV;
  }

  public async getValue(): Promise<IVA> {
    return this.inputV.getValue();
  }

  public reset(): void {
    this.errorV.reset();
    this.inputV.reset();
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
