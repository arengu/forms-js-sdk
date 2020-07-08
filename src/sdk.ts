import includes from 'lodash/includes';
import isNil from 'lodash/isNil';

import { FormPresenter, IFormPresenter } from './form/FormPresenter';

import { FormRepository } from './repository/FormRepository';

import { CSSInjector } from './css/CSSInjector';

import { DOMEvents, EventNames } from './lib/DOMEvents';

import { SDKError } from './error/SDKError';
import { SDKErrorCode } from './error/ErrorCodes';
import { IFormModel } from './form/model/FormModel';
import { FormProcessor } from './form/model/FormProcessor';
import { IFormStyle } from './form/model/FormStyle';

declare const SDK_VERSION: string;

const MAGIC_SELECTOR = 'data-arengu-form-id';

const FIELD_PREFIX = 'data-field-';

const Repository = FormRepository;

export type ICustomValues = Record<string, string>;

export interface ISDK {
  VERSION: string;

  embed(form: string | IFormModel, parent: string | Element,
    customValues?: ICustomValues): Promise<IArenguForm>;
}

export interface IArenguForm {
  getId(): string;
  setHiddenField(key: string, value: string): void;
  updateStyle(style: IFormStyle): void;
}

export const ArenguForm = {
  create(formP: IFormPresenter): IArenguForm {
    return {
      getId(): string {
        return formP.getFormId();
      },
      setHiddenField(fieldId: string, value: string): void {
        formP.setHiddenField(fieldId, value);
      },
      updateStyle(style: IFormStyle): void {
        formP.updateStyle(style);
      },
    };
  },
};

export const SDKHelper = {
  findNode(selector: string): Element {
    const node = document.querySelector(selector);

    if (!node) {
      throw SDKError.create(SDKErrorCode.MISSING_NODE, `There is not any node for the provided criteria [${selector}]`);
    }

    return node;
  },

  async getForm(formId: string | IFormModel): Promise<IFormModel> {
    if (typeof formId === 'object') {
      return formId;
    }

    DOMEvents.emit(EventNames.GetForm, { formId });
    return Repository.getForm((formId))
      .catch((err): never => {
        DOMEvents.emit(EventNames.GetFormError, { formId, error: err });
        throw err;
      })
      .then((form): IFormModel => {
        DOMEvents.emit(EventNames.GetFormSuccess, { formId, data: form });
        return form;
      });
  },

  waitForDom(fn: Function): void {
    const VALID_STATES = ['interactive', 'complete'];

    if (includes(VALID_STATES, document.readyState)) {
      fn();
      return;
    }

    let executed = false;
    document.addEventListener('readystatechange', (): void => {
      if (includes(VALID_STATES, document.readyState) && !executed) {
        executed = true;
        fn();
      }
    });
  },

  parseValues(node: HTMLElement): ICustomValues {
    const custValues: ICustomValues = {};

    try {
      const fieldsJson = node.dataset.fields;
      fieldsJson && Object.assign(custValues, JSON.parse(fieldsJson));
    } catch (err) {
      console.warn('Error parsing data-fields attribute', err.message);
    }

    const allAttrs = Array.from(node.attributes);
    const dataAttrs = allAttrs.filter((at) => at.name.startsWith(FIELD_PREFIX));

    dataAttrs.forEach((at) => {
      const fieldName = at.name.substr(FIELD_PREFIX.length);
      const fieldValue = at.value;

      custValues[fieldName] = fieldValue;
    });

    return custValues;
  }
};

export const SDK: ISDK = {
  VERSION: SDK_VERSION,

  async embed(form: string | IFormModel, parent: string | Element,
    customValues: Record<string, string> = {}): Promise<IArenguForm> {
    if (isNil(form)) {
      throw SDKError.create(SDKErrorCode.MISSING_FORM_ID, 'Specify the form you want to embed');
    }
    if (isNil(parent)) {
      throw SDKError.create(SDKErrorCode.INVALID_NODE, 'Specify the node where you want to embed the form');
    }

    const parentNode = typeof parent === 'string' ? SDKHelper.findNode(parent) : parent;

    const formId = form instanceof Object ? form.id : form;

    const eventData = {
      formId,
      selector: parent instanceof Element ? undefined : parent,
    };

    try {
      const initFormData = await SDKHelper.getForm(form);
      const procFormData = FormProcessor.overwriteForm(initFormData, customValues);

      DOMEvents.emit(EventNames.EmbedForm, eventData);

      const presenter = FormPresenter.create(procFormData);

      const formNode = presenter.render();

      parentNode.appendChild(formNode);

      const formInstance = ArenguForm.create(presenter);

      DOMEvents.emit(EventNames.EmbedFormSuccess, { ...eventData, parent: parentNode, node: formNode, helper: formInstance });

      return formInstance;
    } catch (err) {
      console.error('Error embedding form', err);
      DOMEvents.emit(EventNames.EmbedFormError, { ...eventData, error: err });
      throw err;
    }
  },
};

export const AutoMagic = {
  embedByNode(node: HTMLElement): void {
    const formId = node.dataset.arenguFormId;

    if (!formId) {
      return;
    }

    const customValues = SDKHelper.parseValues(node);

    SDK.embed(formId, node, customValues);
  },

  findNodesAndEmbed(): void {
    const list: NodeListOf<HTMLElement> = document.querySelectorAll(`[${MAGIC_SELECTOR}]`);
    const array = Array.from(list); // old browsers do not implement NodeList.prototype.forEach

    array.forEach((node): void => AutoMagic.embedByNode(node));
  },

  init(): void {
    CSSInjector.injectDefault();
    SDKHelper.waitForDom((): void => {
      DOMEvents.emit(EventNames.SDKInit, { sdk: SDK });
      this.findNodesAndEmbed();
    });
  },
};
