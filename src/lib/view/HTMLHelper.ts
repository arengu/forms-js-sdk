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
   * This method emulates the DOMTokenList.toggle() method with support for
   * the 'force' argument, which is not available on IE11. When support gets
   * dropped for it we can remove this and use directly the native method.
   */
  toggleClass(elem: Element, className: string, force?: boolean): void {
    if (force === undefined) {
      elem.classList.toggle(className);
    } else if (force === true) {
      elem.classList.add(className);
    } else if (force === false) {
      elem.classList.remove(className);
    }
  },

  /**
   * Recreate and replace <script> elements found inside a parent element.
   * Without this, when putting <script> elements inside an innerHTML property
   * they will not be executed.
   */
  recreateScriptElements(container: HTMLElement): void {
    const scripts = container.querySelectorAll('script');

    scripts.forEach((script) => {
      const newScript = document.createElement('script');

      newScript.innerText = script.innerText;

      // ChildNode.replaceWith() is not available on legacy browsers
      script.parentNode?.replaceChild(newScript, script);
    });
  }
};
