import forEach from 'lodash/forEach';
import { HTMLHelper } from "../lib/view/HTMLHelper";
import { IArenguForm } from '../form/FormPresenter';

const FORM_INSTANCE_NAME = '__arenguForm__'
const FORM_ARG_NAME = '$form';

declare const window: {
  [FORM_INSTANCE_NAME]?: IArenguForm;
};

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
    if (HTMLBlockHelperDeps.isInline(script) || script.async || script.defer) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      script.addEventListener('load', () => resolve());
      script.addEventListener('error', () => resolve());
    });
  },


  isInline(script: HTMLScriptElement): boolean {
    return script.src === '';
  },

  wrapWithSdk(oldScript: HTMLScriptElement): HTMLScriptElement {
    const newScript = HTMLBlockHelperDeps.clone(oldScript);

    if (newScript.textContent) {
      newScript.textContent = `(function(${FORM_ARG_NAME}){${newScript.textContent}}(window['${FORM_INSTANCE_NAME}']))`;
    }

    return newScript;
  },

  /**
   * Recreates and replace a script element in the DOM and return a Promise that
   * will resolve when dependent scripts can be loaded
   */
  reinject(oldScript: HTMLScriptElement, formI: IArenguForm): Promise<void> {
    const isInline = HTMLBlockHelperDeps.isInline(oldScript);

    if (isInline) {
      window[FORM_INSTANCE_NAME] = formI;
    }

    const newScript = HTMLBlockHelperDeps.wrapWithSdk(oldScript);

    // onload/onerror listeners must be added before appending to the DOM
    const promise = HTMLBlockHelperDeps.makePromise(newScript);

    HTMLHelper.replaceWith(oldScript, newScript);

    if (isInline) {
      // avoid the temptation of using this global directly from a script
      delete window[FORM_INSTANCE_NAME];
    }

    return promise;
  },

  /**
   * Reinjects script elements sequentially, not injecting a new one until
   * the previous one allows us to continue, in order to account for
   * possible dependencies.
   */
  reinjectSequentially(scripts: HTMLScriptElement[], formI: IArenguForm): Promise<void> {
    return scripts.reduce(
      (prom, script) => prom.then(() => HTMLBlockHelperDeps.reinject(script, formI)),
      Promise.resolve(),
    );
  },
}

export const HTMLBlockHelper = {
  /**
   * Recreates and replace <script> elements. Without this, when putting <script>
   * elements inside an innerHTML property they will not be executed.
   */
  reinjectScripts(container: HTMLElement, formI: IArenguForm): void {
    const scripts = Array.from(container.querySelectorAll('script'));

    HTMLBlockHelperDeps.reinjectSequentially(scripts, formI);
  },
}
