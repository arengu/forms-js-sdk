import { IHTMLView } from '../../base/view/HTMLView';
import { IFormModel } from '../model/FormModel';
import { ICookieModel } from '../model/CookieModel';
import { CookieHelper } from '../../lib/view/CookieHelper';

export interface IFormViewListener {
  onSubmitForm(this: void): void;
}

export type IFormPageView = IHTMLView;

export interface IRedirectionParams {
  readonly delay?: number;
  readonly target: string;
}

export interface IFormView extends IHTMLView {
  showPage(view: IFormPageView): void;
  scrollTop(): void;
}

export abstract class FormRendererer {
  public static renderForm(viewL: IFormViewListener): HTMLFormElement {
    const form = document.createElement('form');
    form.setAttribute('method', 'POST');
    form.setAttribute('novalidate', 'novalidate');

    form.onsubmit = function onSubmit(evt: Event): void {
      evt.preventDefault();
      viewL.onSubmitForm();
    };

    return form;
  }

  public static renderRoot(formM: IFormModel, formE: HTMLFormElement): HTMLDivElement {
    const { id } = formM;

    const root = document.createElement('div');
    root.classList.add(`af-form-${id}`);
    root.classList.add('af-form');

    root.appendChild(formE);

    return root;
  }
}

export class FormView implements IFormView {
  protected formE: HTMLFormElement;

  protected rootE: HTMLDivElement;

  protected constructor(formM: IFormModel, viewL: IFormViewListener) {
    this.formE = FormRendererer.renderForm(viewL);
    this.rootE = FormRendererer.renderRoot(formM, this.formE);
  }

  public static create(formM: IFormModel, viewL: IFormViewListener): FormView {
    return new FormView(formM, viewL);
  }

  public showPage(pageV: IFormPageView): void {
    const currPageE = this.formE.firstChild;

    if (currPageE) {
      currPageE.remove();
    }

    const newPageE = pageV.render();
    this.formE.appendChild(newPageE);
  }

  public scrollTop(): void {
    this.formE.scrollIntoView({ behavior: 'smooth' });
  }

  public reset(): void { // eslint-disable-line class-methods-use-this
    // nothing to do here
  }

  public render(): HTMLDivElement {
    return this.rootE;
  }

  public static redirect(params: IRedirectionParams): void {
    const { target, delay: delayS } = params;

    const delayMS = delayS != null ? delayS * 1000 : 0;

    setTimeout((): void => {
      document.location.href = target;
    }, delayMS);
  }

  public static setCookies(cookies: ICookieModel[]): void {
    cookies.forEach(CookieHelper.set);
  }
}
