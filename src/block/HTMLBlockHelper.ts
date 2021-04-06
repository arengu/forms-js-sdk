import { forEach } from 'lodash';
import { HTMLHelper } from "../lib/view/HTMLHelper";

const HTMLBlockHelperDeps = {
  /**
   * "Clone" a script by creating a new one and copying manually some of its properties.
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
   * Create a Promise that will resolve when the script has finished executing:
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
   * Recreate and replace a script element in the DOM and return a Promise that
   * will resolve when this script finishes executing.
   */
  reinject(script: HTMLScriptElement): Promise<void> {
    const newScript = HTMLBlockHelperDeps.clone(script);
    HTMLHelper.replaceWith(script, newScript);

    return HTMLBlockHelperDeps.makePromise(newScript);
  },

  /**
   * Reinject script elements sequentially, not injecting a new one until
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
   * Recreate and replace <script> elements. Without this, when putting <script>
   * elements inside an innerHTML property they will not be executed.
   */
  reinjectScripts(container: HTMLElement): void {
    const scripts = [...container.querySelectorAll('script')];

    HTMLBlockHelperDeps.reinjectSequentially(scripts);
  },
}
