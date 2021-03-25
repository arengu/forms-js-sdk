import { forEach } from 'lodash';
import { HTMLHelper } from "../lib/view/HTMLHelper";

interface IClassifiedScripts {
  external: HTMLScriptElement[];
  async: HTMLScriptElement[];
  inline: HTMLScriptElement[];
  withOnload: HTMLScriptElement[];
}

const HTMLBlockHelperDeps = {
  classify(scripts: NodeListOf<HTMLScriptElement>): IClassifiedScripts {
    const output: IClassifiedScripts = {
      external: [],
      async: [],
      inline: [],
      withOnload: [],
    };

    forEach(scripts, (script) => {
      if (script.async || script.defer) {
        output.async.push(script);
      } else if (script.src !== '') {
        const onload = script.getAttribute('onload');

        if (onload) {
          const deferred = document.createElement('script');
          deferred.textContent = onload;

          output.inline.push(deferred);
          output.withOnload.push(script);
        }

        output.external.push(script);
      } else {
        output.inline.push(script);
      }
    });

    return output;
  },

  clone(script: HTMLScriptElement): HTMLScriptElement {
    // cloning with Node.cloneNode() would also clone the internal "already
    // started" flag so the script would not execute, so clone manually
    // (see https://stackoverflow.com/a/28771829)
    const newScript = document.createElement('script');

    forEach(script.attributes, (attr) => newScript.setAttribute(attr.name, attr.value));

    newScript.textContent = script.textContent;

    return newScript;
  },

  reinject(script: HTMLScriptElement, beforeAppend?: (newScript: HTMLScriptElement) => void): void {
    const newScript = HTMLBlockHelperDeps.clone(script);

    if (beforeAppend) {
      beforeAppend(newScript);
    }

    HTMLHelper.replaceWith(script, newScript);
  },

  buildPromiseChain(scripts: HTMLScriptElement[]): Promise<void> {
    return scripts.reduce((prom, script) => {
      return prom.then(() => {
        return new Promise((res) => {
          const resolve = (): void => res();

          HTMLBlockHelperDeps.reinject(script, (newScript) => {
            newScript.addEventListener('load', resolve);
            newScript.addEventListener('error', resolve);
          });
        });
      });
    }, Promise.resolve());
  }
}

export const HTMLBlockHelper = {
  /**
   * Recreate and replace <script> elements. Without this, when putting <script>
   * elements inside an innerHTML property they will not be executed.
   */
  reinjectScripts(container: HTMLElement): void {
    const scripts = HTMLBlockHelperDeps.classify(container.querySelectorAll('script'));

    // remove onload events from external scripts, we'll be running those events
    // after inserting the inline sync scripts, to account for possible dependencies
    scripts.withOnload.forEach((script) => script.removeAttribute('onload'));

    // external sync scripts: loaded sequentially in a blocking fashion
    const promise = HTMLBlockHelperDeps.buildPromiseChain(scripts.external);

    // async scripts: loaded whenever, they shouldn't care about order
    scripts.async.forEach((script) => HTMLBlockHelperDeps.reinject(script));

    // inline sync scripts: loaded directly but only after all external
    // scripts finished loading, to account for possible dependencies
    promise.then(() => {
      scripts.inline.forEach((script) => {
        if (script.parentNode) {
          HTMLBlockHelperDeps.reinject(script);
        } else {
          container.appendChild(script);
        }
      });
    });
  }
}
