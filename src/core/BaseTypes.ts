export interface IView {
  render(): HTMLElement;
}

export interface IPresenter {
  render(): HTMLElement;
  reset(): void;
}
