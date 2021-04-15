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
    const scope: IRefScope = {
      field: formValues,
      fields: formValues,
      ...formValues, // support references without namespace to ensure backward compatibility
    };

    return {
      resolve(input: string, escape?: IEscapeFunction): string {
        if (!input.includes('{{')) {
          return input;
        }

        const replaced = StringReplacer.replace(input, replacements, escape);
        const resolved = RefResolver.resolve(replaced, scope, escape);

        return resolved;
      },
    };
  },
}

