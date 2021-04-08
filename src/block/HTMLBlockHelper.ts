import forEach from 'lodash/forEach';
import { HTMLHelper } from "../lib/view/HTMLHelper";

const HTMLBlockHelperDeps = {
  /**
   * Clones a script by creating a new one and copying manually some of its properties.
   *
   * Using Node.cloneNode() would look more reasonable, but that would also copy the
   * internal "already started" flag so the script would not execute when appended
   * to the DOM. See https://stackoverflow.com/a/28771829
   */
  clone(script: HTMLScriptElement): HTMLScriptElement {
    const newScript = document.createElement('script');

    // script-created scripts are always async! copy values from the original script
    newScript.async = script.async;
    newScript.defer = script.defer;

    forEach(script.attributes, (attr) => newScript.setAttribute(attr.name, attr.value));

    newScript.textContent = script.textContent;

    return newScript;
  },

  /**
   * Creates a Promise that will resolve when the script considers execution can continue:
   *  - for inline and async scripts: immediately
   *  - for external sync scripts: when their onload/onerror event is fired
   */
  makePromise(script: HTMLScriptElement): Promise<void> {
    if (script.src === '' || script.async || script.defer) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      script.addEventListener('load', () => resolve());
      script.addEventListener('error', () => resolve());
    });
  },

  /**
   * Recreates and replace a script element in the DOM and return a Promise that
   * will resolve when dependent scripts can be loaded
   */
  reinject(script: HTMLScriptElement): Promise<void> {
    const newScript = HTMLBlockHelperDeps.clone(script);

    // onload/onerror listeners must be added before appending to the DOM
    const promise = HTMLBlockHelperDeps.makePromise(newScript);

    HTMLHelper.replaceWith(script, newScript);

    return promise;
  },

  /**
   * Reinjects script elements sequentially, not injecting a new one until
   * the previous one allows us to continue, in order to account for
   * possible dependencies.
   */
  reinjectSequentially(scripts: HTMLScriptElement[]): Promise<void> {
    return scripts.reduce(
      (prom, script) => prom.then(() => HTMLBlockHelperDeps.reinject(script)),
      Promise.resolve(),
    );
  },
}

export const HTMLBlockHelper = {
  /**
   * Recreates and replace <script> elements. Without this, when putting <script>
   * elements inside an innerHTML property they will not be executed.
   */
  reinjectScripts(container: HTMLElement): void {
    const scripts = Array.from(container.querySelectorAll('script'));

    HTMLBlockHelperDeps.reinjectSequentially(scripts);
  },
}
