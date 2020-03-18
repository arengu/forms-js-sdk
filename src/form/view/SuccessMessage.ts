import { MessageView } from '../../lib/view/MessageView';

const CSS_CLASSES = ['af-step-success', 'af-step-message'];

export class SuccessMessage extends MessageView {
  protected constructor() {
    super(CSS_CLASSES);
  }

  public static create(): SuccessMessage {
    return new SuccessMessage();
  }
}
