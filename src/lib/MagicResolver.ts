import { IReplacements } from "../form/FormInteraction";
import { IRefScope } from "../form/model/FormModel";
import { StringReplacer } from './StringReplacer';
import { RefResolver } from "./RefResolver";
import { IFormData } from "../form/model/SubmissionModel";

export interface IEscapeFunction {
  (str: string): string;
}

export interface IMagicResolver {
  isDynamic(input: string): boolean;
  resolve(input: string, escape?: IEscapeFunction): string;
}

export const MagicResolver = {
  create(formValues: IFormData, replacements: IReplacements): IMagicResolver {
    const scope: IRefScope = {
      ...formValues, // support references without namespace to ensure backward compatibility
      // reserved words for namespaces have more priority than field identifiers
      field: formValues,
      fields: formValues,
    };

    return {
      isDynamic(input: string): boolean {
        return input.includes('{{');
      },

      resolve(input: string, escape?: IEscapeFunction): string {
        if (!this.isDynamic(input)) {
          return input;
        }

        const replaced = StringReplacer.replace(input, replacements, escape);
        const resolved = RefResolver.resolve(replaced, scope, escape);

        return resolved;
      },
    };
  },
}

