class SDKError extends Error {

  constructor (code, message) {
    super(message);
    this.code = code;
  }

  static fromResponse(body) {
    return SDKError.create(body.code, body.message);
  }

  static create () {
    return new SDKError(...arguments);
  }

}

module.exports = SDKError;
