import { ISyncValueHandler } from './ValueHandler';

export const PaymentValueHandler = {
  create(): ISyncValueHandler<undefined> {
    return {
      getValue(): undefined {
        return undefined;
      },

      setDefaultValue(): void {
        // no default value for payment fields
      },

      setValue(): undefined {
        return undefined;
      }
    };
  },
};
