class SDKError extends Error {

  constructor (message) {
    super(message);
  }

  static create () {
    return new SDKError(...arguments);
  }

}

module.exports = SDKError;
