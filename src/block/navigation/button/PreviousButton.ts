import { IPreviousButtonBlockModel } from '../../BlockModel';
import { IBlockPresenter } from '../../BlockPresenter';
import { ButtonPresenterImpl } from "./base/ButtonPresenter";
import { ButtonView, IButtonView } from './base/ButtonView';

export const CSS_CLASSES = ['af-step-previous', 'af-step-button'];

export type IPreviousButtonPresenter = IBlockPresenter;

export type IPreviousButtonView = IButtonView;

export class PreviousButtonPresenterImpl extends ButtonPresenterImpl<IPreviousButtonView> implements IPreviousButtonPresenter {
  public constructor(buttonV: IPreviousButtonView) {
    super(buttonV);
    this.buttonV.subscribe(this);
  }

  public onClick(this: this): void {
    this.listeners.forEach((listener) => listener.onGoToPrevious?.(this));
  }
}

export const PreviousButtonPresenter = {
  create(buttonM: IPreviousButtonBlockModel): IPreviousButtonPresenter {
    return new PreviousButtonPresenterImpl(
      ButtonView.create({
        button: {
          text: buttonM.config.text,
        },
        container: {
          classes: CSS_CLASSES,
        },
      })
    );
  },
}
