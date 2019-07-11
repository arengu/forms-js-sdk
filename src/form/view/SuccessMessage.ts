import { GenericMessageView } from '../../lib/view/GenericMessage';

const CSS_CLASSES = ['af-step-success', 'af-step-message'];

export class SuccessMessage extends GenericMessageView {
  protected constructor() {
    super(CSS_CLASSES);
  }

  public static create(): SuccessMessage {
    return new SuccessMessage();
  }
}
