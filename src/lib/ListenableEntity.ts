export interface IListenableEntity<T> {
  listen(listener: T): void;
}

export abstract class ListenableEntity<T> implements IListenableEntity<T> {
  protected readonly listeners: T[];

  constructor() {
    this.listeners = [];
  }

  public listen(listener: T): void {
    this.listeners.push(listener);
  }
}
