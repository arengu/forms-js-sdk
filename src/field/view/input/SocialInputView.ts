import { IInputView, IInputViewListener } from '../InputView';
import { ListenableEntity } from '../../../lib/ListenableEntity';
import { IButtonView } from '../../../block/navigation/button/base/ButtonView';
import { ISocialLoginData } from './social/base/SocialProviderPresenter';

export type ISocialInputValue = undefined | ISocialLoginData;

export interface ISocialInputView extends IInputView {
  getValue(): undefined;
}

export const SocialInputRenderer = {
  renderRoot(buttonsV: IButtonView[]): HTMLDivElement {
    const root = document.createElement('div');
    root.className = 'af-social';

    buttonsV.forEach((bV) => root.appendChild(bV.render()));

    return root;
  },
}

export class SocialInputViewImpl extends ListenableEntity<IInputViewListener> implements ISocialInputView {
  protected readonly rootE: HTMLDivElement;

  public constructor(buttonsV: IButtonView[]) {
    super();

    this.rootE = SocialInputRenderer.renderRoot(buttonsV);
  }

  public block(): void {
    // nothing to do here
  }
  
  public unblock(): void {
    // nothing to do here
  }

  public reset(): void {
    // nothing to do here
  }

  public getValue(): undefined {
    return undefined;
  }

  public render(): HTMLElement {
    return this.rootE;
  }
}

export const SocialInputView =  {
  create(buttonsV: IButtonView[]): ISocialInputView {
    return new SocialInputViewImpl(buttonsV);
  },
};
