import { IButtonView, ButtonView, IButtonViewOptions, } from './ButtonView';
import { IBlockPresenter } from '../../../BlockPresenter';
import { BaseBlockPresenter } from '../../../../core/BasePresenters';

export enum ButtonStatus {
  ENABLED = 'ENABLED',
  DISABLED = 'DISABLED',
}

export interface IButtonPresenter<V extends IButtonView = IButtonView> extends IBlockPresenter {
  block(): void;
  unblock(): void;
  getView(): V;
}

export type IButtonPresenterOptions = IButtonViewOptions & {
  button: {
    initStatus?: ButtonStatus;
  };
}

export class ButtonPresenterImpl<V extends IButtonView> extends BaseBlockPresenter implements IButtonPresenter<V> {
  protected readonly buttonV: V;
  protected readonly initStatus: ButtonStatus;

  public constructor(buttonV: V, initStatus: ButtonStatus = ButtonStatus.ENABLED) {
    super();

    this.buttonV = buttonV;
    this.initStatus = initStatus;

    if (this.initStatus === ButtonStatus.DISABLED) {
      this.block();
    }
  }

  public render(): HTMLElement {
    return this.buttonV.render();
  }

  public getView(): V {
    return this.buttonV;
  }

  public block(): void {
    this.buttonV.block();
  }

  public unblock(): void {
    this.buttonV.unblock();
  }
}

export const ButtonPresenter = {
  create(options: IButtonPresenterOptions): IButtonPresenter {
    return new ButtonPresenterImpl(
      ButtonView.create(options),
      options.button.initStatus,
    );
  },
}
