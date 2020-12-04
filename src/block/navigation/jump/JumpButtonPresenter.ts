import { IJumpButtonBlockModel } from '../../BlockModel';
import { IJumpButtonView, JumpButtonView } from './JumpButtonView';
import { IAsyncButtonPresenter, AsyncButtonPresenterImpl } from "../button/async/AsyncButtonPresenter";
import { IComponentPresenter } from '../../../component/ComponentPresenter';

export interface IJumpButtonPresenter extends IAsyncButtonPresenter<IJumpButtonView> {
  getId(): string | undefined;
}

export class JumpButtonPresenterImpl extends AsyncButtonPresenterImpl<IJumpButtonView> implements IJumpButtonPresenter {
  readonly fieldId: string | undefined;

  public constructor(buttonM: IJumpButtonBlockModel, buttonV: IJumpButtonView) {
    super(buttonV);
    this.buttonV.subscribe(this);

    this.fieldId = buttonM.id;
  }

  public getId(): string | undefined {
    return this.fieldId;
  }

  public onClick(this: this): void {
    this.listeners.forEach((listener) => listener.onGoForward?.(this));
  }
}

export const JumpButtonPresenter = {
  create(buttonM: IJumpButtonBlockModel): IJumpButtonPresenter {
    return new JumpButtonPresenterImpl(
      buttonM,
      JumpButtonView.create(buttonM.config.text, buttonM.config.style),
    );
  },

  matches(compP: IComponentPresenter): compP is IJumpButtonPresenter {
    return compP instanceof JumpButtonPresenterImpl;
  }
}
