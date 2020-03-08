import { MessageView } from '../../lib/view/MessageView';

export const CSS_CLASSES = ['af-field-error', 'af-field-message'];

export class FieldErrorMessage extends MessageView {
  protected constructor() {
    super(CSS_CLASSES);
  }

  public static create(): FieldErrorMessage {
    return new FieldErrorMessage();
  }
}
