export interface IChildAppender {
  (this: void, elem: HTMLElement): void;
}

export interface IClassAdder {
  (this: void, clazz: string): void;
}

export const HTMLHelper = {
  appendChild(div: HTMLDivElement): IChildAppender {
    return function appender(this: void, elem: HTMLElement): void {
      div.appendChild(elem);
    };
  },

  addClass(elem: HTMLElement): IClassAdder {
    return function appender(this: void, clazz: string): void {
      elem.classList.add(clazz);
    };
  },
};
