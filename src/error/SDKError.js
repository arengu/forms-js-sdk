class SDKError extends Error {

  constructor (code, message) {
    super(message);
    this.code = code;
  }

  static create () {
    return new SDKError(...arguments);
  }

}

module.exports = SDKError;
