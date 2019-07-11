import { IHTMLView } from './view/HTMLView';

export interface IPresenter<HV extends IHTMLView> {
  getView(): HV;
  reset(): void;
}
