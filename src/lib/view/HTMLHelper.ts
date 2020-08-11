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

  /**
   * This is a simple replacement for the DOMTokenList.toggle() method with
   * the 'force' argument since it's not available on IE11. When support gets
   * dropped for it we can remove this and use directly the native method.
   */
  toggleClass(elem: Element, className: string, force: boolean | undefined): void {
    elem.classList.remove(className);

    if (force) {
      elem.classList.add(className);
    }
  }
};
