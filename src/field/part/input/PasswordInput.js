const MD5 = require('crypto-js/md5');
const SHA1 = require('crypto-js/sha1');
const SHA256 = require('crypto-js/sha256');
const SHA512 = require('crypto-js/sha512');
const SHA3 = require('crypto-js/sha3');
const BaseInput = require('./BaseInput');

const PASSWORD_ICON_SECONDARY = 'af-password-icon-secondary';

class PasswordInput extends BaseInput {

  constructor (model, presenter) {
    super(model);

    this.icon = null;
    this.isVisible = false;
    this.model = model;
    this.presenter = presenter;

    this.node = null;
  }

  /*
   * Private methods
   */
  
  _buildInput () {
    const { id, uid, placeholder, required } = this.model;

    const node = document.createElement('input');
    node.setAttribute('id', uid);
    node.setAttribute('name', id);
    node.setAttribute('type', 'password');
    node.setAttribute('autocomplete', 'current-password');

    if (placeholder) {
      node.setAttribute('placeholder', placeholder);
    }

    if (required) {
      node.setAttribute('required', required);
    }

    return node;
  }

  _showPassword () {
    this.node.setAttribute('type', 'text');
    this.icon.classList.add(PASSWORD_ICON_SECONDARY);
    this.isVisible = true;
  }

  _hidePassword () {
    this.node.setAttribute('type', 'password');
    this.icon.classList.remove(PASSWORD_ICON_SECONDARY);
    this.isVisible = false;
  }

  _togglePasswordVisibility () {
    if (this.isVisible) {
      this._hidePassword();
    } else {
      this._showPassword();
    }
  }

  _addIconListener (node) {
    node.addEventListener('click', this._togglePasswordVisibility.bind(this));
  }

  _buildIcon () {
    const node = document.createElement('span');
    node.classList.add('af-password-icon');

    this._addIconListener(node);

    return node;
  }

  _addListeners (node) {
    const presenter = this.presenter;
    const self = this;

    node.onblur = function () {
      presenter.onBlur(self);
    };

    node.onfocus = function () {
      presenter.onFocus(self);
    };

    node.onchange = function () {
      presenter.onChange(self);
    };

    node.onkeydown = function () {
      presenter.onValueChange();
    }
  }

  /*
   * View actions
   */
  build () {
    const container = document.createElement('div');
    container.classList.add('af-password-wrapper');

    const node = this._buildInput();
    container.appendChild(node);

    const icon = this._buildIcon();
    container.appendChild(icon);

    this._addListeners(node);

    this.node = node;
    this.icon = icon;
    this.html = container;
  }

  reset () {
    this.node.value = null;
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

  static create (...args) {
    return new PasswordInput(...args);
  }

}

module.exports = PasswordInput;
