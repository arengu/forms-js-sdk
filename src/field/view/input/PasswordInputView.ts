import { IInputView } from '../InputView';
import { InputCreator, InputConfigurator } from './InputHelper';
import { IView } from "../../../core/BaseTypes";
import { IPasswordFieldModel } from '../../model/FieldModel';
import { StringInputView } from './StringInputView';
import { ListenableEntity } from '../../../lib/ListenableEntity';

const PASSWORD_ICON_SECONDARY = 'af-password-icon-secondary';

export enum PasswordInputType {
  hidden = 'password',
  visible = 'text',
}

export const PasswordInputRenderer = {
  renderInput(fieldM: IPasswordFieldModel): HTMLInputElement {
    const input = InputCreator.input(fieldM, PasswordInputType.hidden);

    InputConfigurator.placeholder(input, fieldM);
    input.autocomplete = 'current-password';

    return input;
  },

  renderIcon(iconL: IPasswordIconListener): HTMLSpanElement {
    const icon = document.createElement('span');
    icon.classList.add('af-password-icon');
    icon.addEventListener('click', iconL.onToggle.bind(iconL));
    return icon;
  },

  renderRoot(inputE: HTMLInputElement, maskV: PasswordMaskView): HTMLDivElement {
    const root = document.createElement('div');
    root.classList.add('af-password-wrapper');

    root.appendChild(inputE);

    const maskE = maskV.render();
    root.appendChild(maskE);

    return root;
  },
};

export interface IPasswordIconListener {
  onToggle(this: this): void;
}

export class PasswordMaskView extends ListenableEntity<IPasswordVisibilityListener> implements IView, IPasswordIconListener {
  protected readonly iconE: HTMLElement;

  protected visible: boolean;

  protected constructor() {
    super();

    this.iconE = PasswordInputRenderer.renderIcon(this);
    this.visible = false;
  }

  public static create(): PasswordMaskView {
    return new this();
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
    this.listeners.forEach((l) => l.onShowPassword());
  }

  public hidePassword(): void {
    this.visible = false;
    this.iconE.classList.remove(PASSWORD_ICON_SECONDARY);
    this.listeners.forEach((l) => l.onHidePassword());
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

export class PasswordInputView extends StringInputView implements IPasswordInputView, IPasswordVisibilityListener {
  protected readonly maskV: PasswordMaskView;

  protected constructor(fieldM: IPasswordFieldModel) {
    const maskV = PasswordMaskView.create();
    const inputE = PasswordInputRenderer.renderInput(fieldM);

    const rootE = PasswordInputRenderer.renderRoot(inputE, maskV);

    super(inputE, rootE);

    this.maskV = maskV;
    this.maskV.listen(this);
  }

  public static create(fieldM: IPasswordFieldModel): IPasswordInputView {
    return new this(fieldM);
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
    super.reset();
    this.hidePassword();
  }
}
