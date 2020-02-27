import md5 from 'md5';
import sha1 from 'hash.js/lib/hash/sha/1';
import sha256 from 'hash.js/lib/hash/sha/256';
import sha512 from 'hash.js/lib/hash/sha/512';

import { IValueHandler } from './ValueHandler';
import { IPasswordFieldModel, IPasswordFieldValue, HashFunction } from '../../model/FieldModel';
import { IPasswordInputView } from '../../view/input/PasswordInputView';

export abstract class PasswordHasher {
  public static hash(password: string, hash: HashFunction): string {
    switch (hash) {
      case HashFunction.MD5:
        return md5(password);
      case HashFunction.SHA1:
        return sha1().update(password).digest('hex');
      case HashFunction.SHA256:
        return sha256().update(password).digest('hex');
      case HashFunction.SHA512:
        return sha512().update(password).digest('hex');
      case HashFunction.NONE:
      default:
        return password;
    }
  }
}

export const PasswordValueHandler = {
  create(inputV: IPasswordInputView, fieldM: IPasswordFieldModel): IValueHandler<IPasswordFieldValue> {
    return {
      getValue(): IPasswordFieldValue {
        const value = inputV.getValue().trim();

        if (value === '') {
          return undefined;
        }

        const hash = PasswordHasher.hash(value, fieldM.config.hash);

        return hash;
      },

      setValue(): void {
        console.error('Setting a password is not allowed.');
      }
    };
  },
};
