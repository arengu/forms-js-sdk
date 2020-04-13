import isNil from 'lodash/isNil';

import { IView } from "../../core/BaseTypes";
import { IFormModel } from '../model/FormModel';
import { ICookieModel } from '../model/CookieModel';
import { CookieHelper } from '../../lib/view/CookieHelper';
import { IPageRedirection } from '../FormInteraction';

export interface IVisibleArea {
  minOffset: number;
  height: number;
  maxOffset: number;
}

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
}

export const FormRendererer = {
  renderForm(viewL: IFormViewListener): HTMLFormElement {
    const form = document.createElement('form');
    form.setAttribute('method', 'POST');
    form.setAttribute('novalidate', 'novalidate');

    form.onsubmit = function onSubmit(evt: Event): void {
      evt.preventDefault();
      viewL.onSubmitForm();
    };

    return form;
  },

  renderRoot(formM: IFormModel, formE: HTMLFormElement): HTMLDivElement {
    const { id } = formM;

    const root = document.createElement('div');
    root.classList.add(`af-form-${id}`);
    root.classList.add('af-form');

    root.appendChild(formE);

    return root;
  },
};

export class FormView implements IFormView {
  protected formE: HTMLFormElement;

  protected rootE: HTMLDivElement;

  protected currE?: HTMLElement;

  protected constructor(formM: IFormModel, viewL: IFormViewListener) {
    this.formE = FormRendererer.renderForm(viewL);
    this.rootE = FormRendererer.renderRoot(formM, this.formE);
  }

  public static create(formM: IFormModel, viewL: IFormViewListener): FormView {
    return new FormView(formM, viewL);
  }

  public setContent(newPageE: HTMLElement): void {
    const isChildren = this.formE.contains(newPageE);

    if (this.currE) {
      this.currE.style.display = 'none';
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

  public static setCookies(cookies: ICookieModel[]): void {
    cookies.forEach((c) => CookieHelper.set(c));
  }
}
