import { ISyncValueHandler } from './ValueHandler';

export const PaymentValueHandler = {
  create(): ISyncValueHandler<undefined> {
    return {
      getValue(): undefined {
        return undefined;
      },

      setValue(): void {
        return undefined;
      }
    };
  },
};
