import { ListenableEntity } from "../lib/ListenableEntity";
import { IComponentPresenter, IComponentPresenterListener } from "../component/ComponentPresenter";
import { IRefsScope } from "../form/model/FormModel";

export abstract class BaseComponentPresenter extends ListenableEntity<IComponentPresenterListener> implements IComponentPresenter {
  public isDynamic(): boolean {
    return false;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public updateContent(this: this, data: IRefsScope): void {
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
