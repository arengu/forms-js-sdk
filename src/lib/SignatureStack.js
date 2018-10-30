class SignatureStack {

  constructor () {
    this.stack = [];
    this.step = -1;
  }

  static create () {
    return new SignatureStack();
  }

  get () {
    const maxIndex = this.step - 1 // signature of current step has to be skipped

    for (let index = maxIndex; index >= maxIndex; index--) {
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
