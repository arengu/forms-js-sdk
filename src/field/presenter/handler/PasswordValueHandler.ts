import md5 from 'md5';
import sha1 from 'hash.js/lib/hash/sha/1';
import sha256 from 'hash.js/lib/hash/sha/256';
import sha512 from 'hash.js/lib/hash/sha/512';
import isNil from 'lodash/isNil';

import { IValueHandler } from './ValueHandler';
import { IPasswordFieldModel, IPasswordFieldValue, HashFunction } from '../../model/FieldModel';
import { IPasswordInputView } from '../../view/input/PasswordInputView';
import { StringValueHandler } from './StringValueHandler';

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

export const PasswordValueHandler: IValueHandler<IPasswordFieldModel,
  IPasswordInputView, IPasswordFieldValue> = {
  async getValue(inputV: IPasswordInputView, fieldM: IPasswordFieldModel):
    Promise<IPasswordFieldValue> {
    const cleanValue = await StringValueHandler.getValue(inputV, fieldM);
    return isNil(cleanValue)
      ? undefined
      : PasswordHasher.hash(cleanValue, fieldM.config.hash);
  },

  async setValue(): Promise<void> {
    // we must not inject its value for security purposes
  },
};
