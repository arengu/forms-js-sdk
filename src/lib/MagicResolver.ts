import { IReplacements } from "../form/FormInteraction";
import { IRefScope } from "../form/model/FormModel";
import { StringReplacer } from './StringReplacer';
import { RefResolver } from "./RefResolver";

export interface IEscapeFunction {
  (str: string): string;
}

export interface IMagicResolver {
  resolve(input: string, escape?: IEscapeFunction): string;
}

export const MagicResolver = {
  create(scope: IRefScope, replacements: IReplacements): IMagicResolver {
    return {
      resolve(input: string, escape?: IEscapeFunction): string {
        const replaced = StringReplacer.replace(input, replacements, escape);
        const resolved = RefResolver.resolve(replaced, scope, escape);

        return resolved;
      },
    };
  },
}

