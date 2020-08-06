import { IFieldPresenter } from "../field/presenter/presenter/FieldPresenter";
import { ListenableEntity } from "../lib/ListenableEntity";
import { IComponentPresenter, IComponentPresenterListener } from "./ComponentPresenter";
import { IFormData } from "../form/model/SubmissionModel";

export const ComponentHelper = {
  isFieldPresenter(compP: IComponentPresenter): compP is IFieldPresenter {
    return typeof (compP as IFieldPresenter).getFieldId === 'function';
  }
};

export abstract class BaseComponentPresenter extends ListenableEntity<IComponentPresenterListener> implements IComponentPresenter {
  public isDynamic(): boolean {
    return false;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public updateContent(this: this, data: IFormData): void {
    // nothing to do
  }

  public render(): HTMLElement {
    throw new Error('Method not implemented.');
  }

  public reset(): void {
    // nothing to do
  }
}
