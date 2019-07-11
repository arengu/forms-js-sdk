import { IHTMLView } from '../../base/view/HTMLView';

export abstract class ViewHelper {
  public static render(view: IHTMLView): HTMLElement {
    return view.render();
  }
}
