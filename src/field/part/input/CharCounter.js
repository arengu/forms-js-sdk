const ALERT_CLASS = 'af-counter-alert';
const ALERT_VALUE = 95;
const WARNING_CLASS = 'af-counter-warning';
const WARNING_VALUE = 80;

class CharCounter {

  constructor (maxLength, defaultValue) {
    this.counter = null; // lazy initialization
    this.current = null; // lazy initialization

    this.maxLength = maxLength;
    this.defaultValue = defaultValue;
  }

  _getClassByPercentage (percentage) {
    if (percentage >= ALERT_VALUE) {
      return ALERT_CLASS;
    }
    if (percentage >= WARNING_VALUE) {
      return WARNING_CLASS;
    }

    return null;
  }

  _checkCounterClass (value) {
    const percentage = (value / this.maxLength) * 100;
    let extraClass = this._getClassByPercentage(percentage);

    this.counter.classList.remove(ALERT_CLASS, WARNING_CLASS);

    if (extraClass) {
      return this.counter.classList.add(extraClass);
    }
    
    return null;

  }

  setValue (node) {
    const value = node.value.length;

    this._checkCounterClass(value);

    this.current.innerText = value;
  }

  render () {
    const counter = document.createElement('div');
    counter.classList.add('af-counter');

    const current = document.createElement('div');
    current.classList.add('af-counter-current');
    counter.appendChild(current);

    const value = this.defaultValue ? this.defaultValue.length : 0;
    current.innerText = value;

    const separator = document.createElement('div');
    separator.classList.add('af-counter-separator');
    separator.innerText = '/';
    counter.appendChild(separator);

    const maximum = document.createElement('div');
    maximum.classList.add('af-counter-maximum');
    maximum.innerText = this.maxLength;
    counter.appendChild(maximum);

    this.current = current;
    this.counter = counter;

    this._checkCounterClass(value);

    return counter;
  }

  static create (...args) {
    return new CharCounter(...args);
  }

}

module.exports = CharCounter;
