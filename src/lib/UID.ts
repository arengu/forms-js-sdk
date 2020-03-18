let counter = 400;

export const PREFIX = 'af-uid';

export const UID = {
  create(): string {
    counter += 1;
    return `${PREFIX}-${counter}`;
  },
};
