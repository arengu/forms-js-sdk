import { IReplacements } from "../form/FormInteraction";
import { IRefScope } from "../form/model/FormModel";
import { StringReplacer } from './StringReplacer';
import { RefResolver } from "./RefResolver";
import { IFormData } from "../form/model/SubmissionModel";

const DYNAMIC_REGEX = /{{\s*[a-z0-9_-]+(?:\.[a-z0-9_-]+)*\s*}}/i;

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
      field: formValues,
      fields: formValues,
      ...formValues, // support references without namespace to ensure backward compatibility
    };

    return {
      isDynamic: DYNAMIC_REGEX.test.bind(DYNAMIC_REGEX),

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

