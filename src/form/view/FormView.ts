import isNil from 'lodash/isNil';
import defaultTo from 'lodash/defaultTo';

import { StyleHelper } from "./StyleHelper";

import { IView } from "../../core/BaseTypes";
import { IFormModel } from '../model/FormModel';
import { IPageRedirection } from '../FormInteraction';
import { IExtendedFormStyle } from '../model/FormStyle';
import { HTMLHelper } from '../../lib/view/HTMLHelper';

export interface IVisibleArea {
  minOffset: number;
  height: number;
  maxOffset: number;
}

const BRAND_CLASS = 'af-branding';
const BRAND_URL = 'https://www.arengu.com/?utm_source=Powered-by&utm_medium=Arengu&utm_content=';
const BRAND_TEXT = 'Powered by Arengu';

export const FormViewHelper = {
  getVisibleArea(): IVisibleArea {
    const currScroll = window.scrollY;
    const vpHeight = window.innerHeight;

    return {
      minOffset: currScroll,
      height: vpHeight,
      maxOffset: currScroll + vpHeight,
    };
  },

  getOffset(elem: Element | undefined): number {
    if (!(elem instanceof HTMLElement)) {
      return 0;
    }

    /*
     * offsetTop property is relative to its parent, so we have to get the offsetTop
     * of the parents recursively until we reach the absolute parent.
     */
    const offsetParent = elem.offsetParent || undefined;
    return this.getOffset(offsetParent) + (elem.offsetTop);
  },

  scrollTo(elem: HTMLElement): void {
    elem.scrollIntoView({ behavior: 'smooth' });
  },
};

export interface IFormViewListener {
  onSubmitForm(this: void): void;
}

export type IFormPageView = IView;

export interface IFormView extends IView {
  setContent(pageE: HTMLElement): void;
  scrollTopIfNeeded(): void;
  setStyle(style: IExtendedFormStyle): void;
}

export const FormRendererer = {
  renderForm(viewL: IFormViewListener): HTMLFormElement {
    const form = document.createElement('form');
    form.setAttribute('method', 'POST');
    form.setAttribute('novalidate', 'novalidate');

    form.classList.add('af-custom-style');

    const button = document.createElement('button');
    button.setAttribute('type', 'submit');
    button.style.display = 'none'
    form.appendChild(button);

    form.onsubmit = function onSubmit(evt: Event): void {
      evt.preventDefault();
      viewL.onSubmitForm();
    };

    return form;
  },

  renderSubmit(): HTMLButtonElement {
    const button = document.createElement('button');

    button.setAttribute('type', 'submit');
    button.style.display = 'none'

    return button;
  },

  buildCss(style: IExtendedFormStyle, formId: string): string {
    return StyleHelper.buildCss(formId, {
      '--primary-color': style.primaryColor,
      '--font-family': style.body?.fontFamily,
      '--font-size': style.body?.fontSize,
      '--font-color': style.body?.fontColor,
      '--input-font-color': style.input?.fontColor,
      '--border-focus-color': style.input?.fontColor,
      '--input-font-size': style.input?.fontSize,
      '--input-background-color': style.input?.backgroundColor,
      '--label-font-color': style.label?.fontColor,
      '--label-font-size': style.label?.fontSize,
      '--field-error-font-color': style.error?.fontColor,
      '--message-success-font-color': style.success?.fontColor,
      '--message-fail-font-color': style.error?.fontColor,
      '--invalid-field-border-color': style.error?.fontColor,
      '--dropdown-background-color': style.input?.backgroundColor,

      '--primary-font-color': style.calculated?.primaryFontColor,

      '--input-border-color': style.calculated?.inputBorderColor,
      '--input-border-radius': style.calculated?.inputBorderRadius,
      '--button-border-radius': style.calculated?.buttonBorderRadius,
      '--message-border-radius': style.calculated?.messageBorderRadius,
      '--checkbox-border-radius': style.calculated?.checkboxBorderRadius,
      '--placeholder-font-color': style.calculated?.placeholderFontColor,
      '--placeholder-focus-font-color': style.calculated?.placeholderFocusFontColor,

      '--dropdown-option-background-color': style.calculated?.dropdownOptionBackgroundColor,
      '--dropdown-option-active-background-color': style.calculated?.dropdownOptionActiveBackgroundColor,
      '--dropdown-option-hover-background-color': style.calculated?.dropdownOptionHoverBackgroundColor,

      '--hint-font-size': style.calculated?.hintFontSize,
      '--legal-font-size': style.calculated?.legalFontSize,
      '--field-error-font-size': style.calculated?.fieldErrorFontSize,
      '--message-fail-font-size': style.calculated?.messageFailFontSize,
      '--divider-font-size': style.calculated?.dividerFontSize,

      '--legal-font-color': style.calculated?.legalFontColor,
      '--label-hover-background-color': style.calculated?.labelHoverBackgroundColor,

      '--hint-font-color': style.calculated?.hintFontColor,

      '--invalid-field-background-color': style.calculated?.invalidFieldBackgroundColor,
      '--message-fail-background-color': style.calculated?.messageFailBackgroundColor,
      '--message-success-background-color': style.calculated?.messageSuccessBackgroundColor,
    });
  },

  renderRoot(formM: IFormModel, formE: HTMLFormElement, styleE: HTMLStyleElement): HTMLDivElement {
    const { id } = formM;

    const root = document.createElement('div');
    root.classList.add(`af-form-${id}`, 'af-form');

    root.appendChild(formE);
    root.appendChild(styleE);

    return root;
  },

  appendBranding(container: HTMLElement, formId: string): void {
    const brand = document.createElement('div');
    brand.className = BRAND_CLASS;

    const link = document.createElement('a');
    link.href = `${BRAND_URL}${formId}`;
    link.innerText = BRAND_TEXT;
    link.target = '_blank';
    link.rel = 'noopener';

    brand.appendChild(link)

    container.appendChild(brand);
  }
};

export class FormView implements IFormView {
  protected formM: IFormModel;

  protected formE: HTMLFormElement;

  protected rootE: HTMLDivElement;

  protected currE?: HTMLElement;

  protected styleE: HTMLStyleElement;

  protected constructor(formM: IFormModel, viewL: IFormViewListener) {
    this.formM = formM;
    this.styleE = document.createElement('style');

    this.formE = FormRendererer.renderForm(viewL);
    this.formE.appendChild(FormRendererer.renderSubmit());

    this.rootE = FormRendererer.renderRoot(this.formM, this.formE, this.styleE);
  }

  public static create(formM: IFormModel, viewL: IFormViewListener): FormView {
    return new FormView(formM, viewL);
  }

  public setContent(newPageE: HTMLElement): void {
    const isChildren = this.formE.contains(newPageE);

    if (this.currE) {
      this.currE.style.display = 'none';
    } else if (this.formM.branding) { // first screen and branding is enabled
      FormRendererer.appendBranding(newPageE, this.formM.id);
    }

    if (isChildren) {
      newPageE.style.display = 'inherit';
    } else {
      this.formE.appendChild(newPageE);
    }

    this.currE = newPageE;
  }

  /**
   * Scroll when the first field is not visible in the 3/4 parts of the visible area
   */
  public scrollTopIfNeeded(): void {
    const visArea = FormViewHelper.getVisibleArea();

    const formWrapper = this.rootE;
    const formOffset = FormViewHelper.getOffset(formWrapper);

    if (formOffset > visArea.maxOffset) {
      FormViewHelper.scrollTo(formWrapper);
      return;
    }

    if (formOffset >= visArea.minOffset) {
      return;
    }

    const headerHeight = visArea.height * 0.25;

    FormViewHelper.scrollTo(
      formOffset < headerHeight
        ? document.body
        : formWrapper,
    );
  }

  public reset(): void { // eslint-disable-line class-methods-use-this
    // nothing to do here
  }

  public render(): HTMLDivElement {
    return this.rootE;
  }

  public static redirect(params: IPageRedirection): void {
    const { target, delay: delayS } = params;

    const delayMS = !isNil(delayS) ? delayS * 1000 : 0;

    setTimeout((): void => {
      document.location.href = target;
    }, delayMS);
  }

  public static setCookies(cookies: string[]): void {
    cookies.forEach((c) => document.cookie = c);
  }

  public setStyle(style: IExtendedFormStyle): void {
    HTMLHelper.toggleClass(
      this.formE,
      'af-alt-input-icons',
      defaultTo(style.calculated.altInputIcons, false),
    );

    HTMLHelper.toggleClass(
      this.formE,
      'af-alt-dropdown-icons',
      defaultTo(style.calculated.altDropdownIcons, false),
    );

    this.styleE.textContent = FormRendererer.buildCss(style, this.formM.id);
  }
}
