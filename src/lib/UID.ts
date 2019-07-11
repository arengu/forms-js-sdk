let counter = 400;

export const PREFIX = 'af-uid';

export abstract class UID {
  public static create(): string {
    counter += 1;
    return `${PREFIX}-${counter}`;
  }
}
