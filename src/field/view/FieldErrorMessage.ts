import { GenericMessageView } from '../../lib/view/GenericMessage';

export const CSS_CLASSES = ['af-field-error', 'af-field-message'];

export class FieldErrorMessage extends GenericMessageView {
  protected constructor() {
    super(CSS_CLASSES);
  }

  public static create(): FieldErrorMessage {
    return new FieldErrorMessage();
  }
}
