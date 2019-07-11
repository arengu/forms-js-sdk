import { GenericMessageView } from '../../lib/view/GenericMessage';

export const CSS_CLASSES = ['af-step-failure', 'af-step-message'];

export class StepErrorMessage extends GenericMessageView {
  protected constructor() {
    super(CSS_CLASSES);
  }

  public static create(): StepErrorMessage {
    return new StepErrorMessage();
  }
}
