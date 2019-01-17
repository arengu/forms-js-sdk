class SDKError extends Error {

  constructor (code, message) {
    super(message);
    this.code = code;
  }

  static fromResponse(body) {
    return SDKError.create(body.code, body.message);
  }

  static create (...args) {
    return new SDKError(...args);
  }

}

module.exports = SDKError;
