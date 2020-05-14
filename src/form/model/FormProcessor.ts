import defaultTo from 'lodash/defaultTo';
import includes from 'lodash/includes';
import isNil from 'lodash/isNil';

import { IFormModel } from "./FormModel";
import { ComponentCategory } from "../../component/ComponentModel";
import { FieldType, IFieldModel, IBooleanFieldModel, IDateFieldModel, IEmailFieldModel, ITelFieldModel, IURLFieldModel, ITextFieldModel, INumberFieldModel, IChoiceFieldModel, IDropdownFieldModel } from "../../field/model/FieldModel";
import { URLHelper } from '../../lib/URLHelper';
import { IHiddenFieldsDef } from '../HiddenFields';
import { ICustomValues } from '../../sdk';

type ISimpleField = IBooleanFieldModel | IDateFieldModel | IEmailFieldModel | ITelFieldModel | ITextFieldModel | IURLFieldModel;

type IMultiField = IChoiceFieldModel | IDropdownFieldModel;

const SIMPLE_FIELDS: FieldType[] = [
  FieldType.BOOLEAN,
  FieldType.DATE,
  FieldType.EMAIL,
  FieldType.TEL,
  FieldType.TEXT,
  FieldType.URL,
  FieldType.CHOICE,
  FieldType.DROPDOWN,
];

const MULTI_FIELDS: FieldType[] = [
  FieldType.CHOICE,
  FieldType.DROPDOWN,
];

const ProcessorHelper = {
  isStringField(fieldM: IFieldModel): fieldM is ISimpleField {
    return includes(SIMPLE_FIELDS, fieldM.type);
  },

  isNumericalField(fieldM: IFieldModel): fieldM is INumberFieldModel {
    return fieldM.type === FieldType.NUMBER;
  },

  isMultiField(fieldM: IFieldModel): fieldM is IMultiField {
    return includes(MULTI_FIELDS, fieldM.type);
  },

  toArray<T>(arr: T | T[]): T[] {
    return Array.isArray(arr) ? arr : [arr];
  },

  getCustomValue(fieldId: string, custValues: ICustomValues): string | undefined {
    return defaultTo(URLHelper.getParam(fieldId), custValues[fieldId]);
  },
};

export const FormProcessor = {

  overwriteHiddenFields(hiddenFields: IHiddenFieldsDef, customValues: ICustomValues): IHiddenFieldsDef {
    return hiddenFields.map((hf) => ({
      ...hf,
      value: defaultTo(ProcessorHelper.getCustomValue(hf.key, customValues), hf.value),
    }));
  },

  overwriteField<K extends IFieldModel>(fieldM: K, custValues: ICustomValues): K {
    const fieldId = fieldM.id;
    const newValue = ProcessorHelper.getCustomValue(fieldId, custValues);

    if (isNil(newValue)) {
      return fieldM;
    }

    if (ProcessorHelper.isStringField(fieldM)) {
      return {
        ...fieldM,
        config: {
          ...fieldM.config,
          defaultValue: newValue,
        }
      }
    }

    if (ProcessorHelper.isMultiField(fieldM)) {
      return {
        ...fieldM,
        config: {
          ...fieldM.config,
          defaultValue: fieldM.config.multiple ? ProcessorHelper.toArray(newValue) : newValue,
        }
      }
    }

    if (ProcessorHelper.isNumericalField(fieldM)) {
      return {
        ...fieldM,
        config: {
          ...fieldM.config,
          defaultValue: defaultTo(+newValue, undefined),
        }
      }
    }

    return fieldM;
  },

  overwriteForm(formM: IFormModel, custValues: ICustomValues): IFormModel {
    return {
      ...formM,
      hiddenFields: FormProcessor.overwriteHiddenFields(formM.hiddenFields, custValues),
      steps: formM.steps.map((step) => ({
        ...step,
        components: step.components.map((comp) => {
          if (comp.category !== ComponentCategory.FIELD) {
            return comp;
          }

          return FormProcessor.overwriteField(comp, custValues);
        }),
      })),
    };
  }
}
