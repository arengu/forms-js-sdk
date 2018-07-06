class BaseView {

  constructor () {
    this.html = null;
  }

  getId () {
  }

  build () {
  }

  render () {
    if (!this.html) {
      this.build();
    }

    return this.html;
  }

}

module.exports = BaseView;
