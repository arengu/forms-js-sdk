import { GenericButtonView, ButtonType, IGenericButtonView } from '../GenericButtonView';

export const CSS_CLASSES = ['af-step-next', 'af-step-button'];

export type INextButtonView = IGenericButtonView;

export class NextButtonView extends GenericButtonView {
  protected constructor(text: string) {
    super({
      text,
      type: ButtonType.SUBMIT,
      containerClasses: CSS_CLASSES,
    });
  }

  public static create(text: string): INextButtonView {
    return new NextButtonView(text);
  }
}
