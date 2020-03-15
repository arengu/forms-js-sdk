import cssRules from './style.css';

export const CSSInjector = {
  injectDefault(): void {
    const style = document.createElement('style');
    style.setAttribute('type', 'text/css');

    const content = document.createTextNode(cssRules);
    style.appendChild(content);

    const head = document.querySelector('head');
    if (head) {
      head.appendChild(style);
    }
  },
};
