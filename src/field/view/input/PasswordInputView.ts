import { IInputViewListener, IInputView, BaseInputView } from '../InputView';
import { InputCreator, InputConfigurator } from './InputHelper';
import { IView } from "../../../core/BaseTypes";
import { IPasswordFieldModel } from '../../model/FieldModel';

const PASSWORD_ICON_SECONDARY = 'af-password-icon-secondary';

export enum PasswordInputType {
  hidden = 'password',
  visible = 'text',
}

export abstract class PasswordInputRenderer {
  public static renderInput(fieldM: IPasswordFieldModel,
    inputV: PasswordInputView): HTMLInputElement {
    const input = InputCreator.input(fieldM, PasswordInputType.hidden);

    InputConfigurator.placeholder(input, fieldM);
    InputConfigurator.addListeners(input, inputV);
    input.autocomplete = 'current-password';

    return input;
  }

  public static renderIcon(iconL: IPasswordIconListener): HTMLSpanElement {
    const icon = document.createElement('span');
    icon.classList.add('af-password-icon');
    icon.addEventListener('click', iconL.onToggle.bind(iconL));
    return icon;
  }

  public static renderRoot(inputE: HTMLInputElement, maskV: PasswordMaskView): HTMLDivElement {
    const root = document.createElement('div');
    root.classList.add('af-password-wrapper');

    root.appendChild(inputE);

    const maskE = maskV.render();
    root.appendChild(maskE);

    return root;
  }
}

export interface IPasswordIconListener {
  onToggle(this: this): void;
}

export class PasswordMaskView implements IView, IPasswordIconListener {
  protected readonly iconE: HTMLElement;

  protected readonly visL: IPasswordVisibilityListener;

  protected visible: boolean;

  protected constructor(visL: IPasswordVisibilityListener) {
    this.iconE = PasswordInputRenderer.renderIcon(this);
    this.visL = visL;
    this.visible = false;
  }

  public static create(iconL: IPasswordVisibilityListener): PasswordMaskView {
    return new this(iconL);
  }

  public onToggle(): void {
    if (this.visible) {
      this.hidePassword();
    } else {
      this.showPassword();
    }
  }

  public showPassword(): void {
    this.visible = true;
    this.iconE.classList.add(PASSWORD_ICON_SECONDARY);
    this.visL.onShowPassword();
  }

  public hidePassword(): void {
    this.visible = false;
    this.iconE.classList.remove(PASSWORD_ICON_SECONDARY);
    this.visL.onHidePassword();
  }

  public reset(): void {
    this.hidePassword();
  }

  public render(): HTMLElement {
    return this.iconE;
  }
}

export interface IPasswordVisibilityListener {
  onShowPassword(this: this): void;
  onHidePassword(this: this): void;
}

export type IPasswordInputValue = string;

export interface IPasswordInputView extends IInputView {
  getValue(): IPasswordInputValue;
}

export class PasswordInputView extends BaseInputView<IInputViewListener> implements IPasswordInputView, IPasswordVisibilityListener {
  protected readonly maskV: PasswordMaskView;

  protected readonly inputE: HTMLInputElement;

  protected readonly rootE: HTMLElement;

  protected constructor(fieldM: IPasswordFieldModel) {
    super();

    this.inputE = PasswordInputRenderer.renderInput(fieldM, this);
    this.maskV = PasswordMaskView.create(this);
    this.rootE = PasswordInputRenderer.renderRoot(this.inputE, this.maskV);
  }

  public static create(fieldM: IPasswordFieldModel): IPasswordInputView {
    return new this(fieldM);
  }

  public getInputId(): string {
    return this.inputE.id;
  }

  public getValue(): IPasswordInputValue {
    return this.inputE.value;
  }

  public setValue(): void {
    throw new Error('Not allowed for security purposes');
  }

  public showPassword(): void {
    this.inputE.setAttribute('type', PasswordInputType.visible);
  }

  public hidePassword(): void {
    this.inputE.setAttribute('type', PasswordInputType.hidden);
  }

  public onShowPassword(): void {
    this.showPassword();
  }

  public onHidePassword(): void {
    this.hidePassword();
  }

  public reset(): void {
    this.inputE.value = this.inputE.defaultValue;
    this.hidePassword();
  }

  public block(): void {
    this.inputE.disabled = true;
  }

  public unblock(): void {
    this.inputE.disabled = false;
  }

  public render(): HTMLElement {
    return this.rootE;
  }
}
