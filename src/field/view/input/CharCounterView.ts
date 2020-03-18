import { IView } from "../../../core/BaseTypes";

const ALERT_CLASS = 'af-counter-alert';
const ALERT_VALUE = 95;
const WARNING_CLASS = 'af-counter-warning';
const WARNING_VALUE = 80;

export type CountableInput = HTMLInputElement | HTMLTextAreaElement;

export const CharCounterRenderer = {
  renderCounter(): HTMLDivElement {
    const counter = document.createElement('div');
    counter.classList.add('af-counter-current');

    return counter;
  },

  renderSeparator(): HTMLDivElement {
    const separator = document.createElement('div');
    separator.classList.add('af-counter-separator');
    separator.textContent = '/';

    return separator;
  },

  renderLimit(maxLength: number): HTMLDivElement {
    const limit = document.createElement('div');
    limit.classList.add('af-counter-maximum');

    limit.textContent = maxLength.toString();

    return limit;
  },

  renderRoot(counterE: HTMLDivElement, maxLength: number): HTMLDivElement {
    const root = document.createElement('div');
    root.classList.add('af-counter');

    root.appendChild(counterE);

    const separator = this.renderSeparator();
    root.appendChild(separator);

    const limit = this.renderLimit(maxLength);
    root.appendChild(limit);

    return root;
  },

  getClassByPercentage(percentage: number): string | undefined {
    if (percentage >= ALERT_VALUE) {
      return ALERT_CLASS;
    }
    if (percentage >= WARNING_VALUE) {
      return WARNING_CLASS;
    }
    return undefined;
  },
};

export class CharCounterView implements IView {
  protected readonly inputE: CountableInput;

  protected readonly counterE: HTMLDivElement;

  protected readonly rootE: HTMLDivElement;

  protected readonly maxLength: number;

  protected constructor(inputE: CountableInput, maxLength: number) {
    this.inputE = inputE;
    this.counterE = CharCounterRenderer.renderCounter();
    this.rootE = CharCounterRenderer.renderRoot(this.counterE, maxLength);
    this.maxLength = maxLength;
    inputE.addEventListener('input', this.update.bind(this));
    this.update();
  }

  public static create(inputE: CountableInput, maxLength: number): CharCounterView {
    return new this(inputE, maxLength);
  }

  public updateCSS(currLength: number): void {
    const percentage = (currLength / this.maxLength) * 100;
    const extraClass = CharCounterRenderer.getClassByPercentage(percentage);

    this.rootE.classList.remove(ALERT_CLASS, WARNING_CLASS);

    if (extraClass) {
      this.rootE.classList.add(extraClass);
    }
  }

  public update(): void {
    const currLength = this.inputE.value.length;
    this.counterE.textContent = currLength.toString();
    this.updateCSS(currLength);
  }

  public render(): HTMLElement {
    return this.rootE;
  }

  public reset(): void { // eslint-disable-line class-methods-use-this
    // Nothing to do here
  }
}
