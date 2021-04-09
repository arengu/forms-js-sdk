import { ListenableEntity } from "../lib/ListenableEntity";
import { IComponentPresenter, IComponentPresenterListener } from "../component/ComponentPresenter";
import { IMagicResolver } from "../lib/MagicResolver";

export abstract class BaseComponentPresenter extends ListenableEntity<IComponentPresenterListener> implements IComponentPresenter {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public updateContent(this: this, resolver: IMagicResolver, everShown: boolean): void {
    // nothing to do
  }

  public render(): HTMLElement {
    throw new Error('Method not implemented.');
  }

  public reset(): void {
    // nothing to do
  }
}

export class BaseBlockPresenter extends BaseComponentPresenter { }
