import { IComponentView } from '../../component/ComponentModel';
import { IMessageView, MessageView } from '../../lib/view/MessageView';

export const CSS_CLASSES = ['af-step-failure', 'af-step-message'];

export type IStepErrorView = IMessageView;

export const StepErrorRenderer = {
  wrapError(errorE: HTMLElement): HTMLDivElement {
    const wrapper = document.createElement('div');
    wrapper.classList.add('af-step-messages');

    wrapper.appendChild(errorE);

    return wrapper;
  },
};

export class StepErrorView extends MessageView implements IStepErrorView, IComponentView {
  protected constructor() {
    super(CSS_CLASSES);
  }

  public static create(): IStepErrorView {
    return new StepErrorView();
  }

  public render(): HTMLDivElement {
    const errorE = super.render();
    return StepErrorRenderer.wrapError(errorE); // for backward compatibility
  }
}
