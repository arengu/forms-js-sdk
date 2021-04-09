import reduce from 'lodash/reduce';
import identity from 'lodash/identity';
import { IReplacements } from "../form/FormInteraction"
import { IEscapeFunction } from "./MagicResolver"
import { StringUtils } from './util/StringUtils';

export const StringReplacer = {
  replace(input: string, replacements: IReplacements, escape: IEscapeFunction = identity): string {
    return reduce(
      replacements,
      (str, replacement, needle) => StringUtils.replaceAll(str, needle, escape(replacement)),
      input,
    );
  }
}
