import { IReplacements } from "../form/FormInteraction";
import { IRefScope } from "../form/model/FormModel";
import { StringReplacer } from './StringReplacer';
import { RefResolver } from "./RefResolver";
import { IFormData } from "../form/model/SubmissionModel";

export interface IEscapeFunction {
  (str: string): string;
}

export interface IMagicResolver {
  resolve(input: string, escape?: IEscapeFunction): string;
}

export const MagicResolver = {
  create(formValues: IFormData, replacements: IReplacements): IMagicResolver {
    // we have to support temporarily both old and new formats to ensure backward compatibility
    const scope: IRefScope = { field: formValues, ...formValues };

    return {
      resolve(input: string, escape?: IEscapeFunction): string {
        const replaced = StringReplacer.replace(input, replacements, escape);
        const resolved = RefResolver.resolve(replaced, scope, escape);

        return resolved;
      },
    };
  },
}

