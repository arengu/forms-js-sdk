class SignatureStack {

  constructor () {
    this.stack = [];
    this.step = -1;
  }

  static create () {
    return new SignatureStack();
  }

  get (includeCurrent) {
    // We have to skip signature of current step for validations
    // but form submissions require it to probe it was validated
    const maxIndex = this.step - (includeCurrent ? 0 : 1);

    for (let index = maxIndex; index >= 0; index--) {
      const signature = this.stack[index];

      if (signature) {
        return signature;
      }
    }

    return null;
  }

  set (signature) {
    this.stack[this.step] = signature;
  }

  goto (step) {
    this.step = step;
    const newLength = step + 1;

    if (newLength > this.stack.length) {
      this.stack.length = newLength;
    }
  }

  previous () {
    this.goto(this.step - 1);
  }

  next () {
    this.goto(this.step + 1);
  }

}

module.exports = SignatureStack;
