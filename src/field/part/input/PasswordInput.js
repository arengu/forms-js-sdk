const MD5 = require('crypto-js/md5');
const SHA1 = require('crypto-js/sha1');
const SHA256 = require('crypto-js/sha256');
const SHA512 = require('crypto-js/sha512');
const SHA3 = require('crypto-js/sha3');
const BaseInput = require('./BaseInput');

class PasswordInput extends BaseInput {

  constructor (model) {
    super(model);

    this.node = null;
  }

  /*
   * Private methods
   */
  
  _buildInput () {
    const { id, uid, placeholder } = this.model;

    const node = document.createElement('input');
    node.setAttribute('id', uid);
    node.setAttribute('name', id);
    node.setAttribute('type', 'password');

    if (placeholder) {
      node.setAttribute('placeholder', placeholder);
    }

    return node;
  }

  /*
   * View actions
   */
  build () {
    const container = document.createElement('div');
    container.classList.add('af-field-wrapper');

    const node = this._buildInput();
    container.appendChild(node);

    this.node = node;
    this.html = container;
  }

  get value () {
    const { config: { hash } } = this.model;

    switch(hash) {
      case 'MD5':
        return MD5(this.node.value).toString();
      case 'SHA1':
        return SHA1(this.node.value).toString();
      case 'SHA256':
        return SHA256(this.node.value).toString();
      case 'SHA512':
        return SHA512(this.node.value).toString();
      case 'SHA3':
        return SHA3(this.node.value).toString();
      case 'NONE':
      default:
        return this.node.value;
    }
  }

  static create () {
    return new PasswordInput(...arguments);
  }

}

module.exports = PasswordInput;
