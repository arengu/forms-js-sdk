class SDKError extends Error {

  static create () {
    return new SDKError(...arguments);
  }

}

module.exports = SDKError;
