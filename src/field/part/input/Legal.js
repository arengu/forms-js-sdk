const BaseView = require('../../../base/BaseView');

class Legal extends BaseView{

  constructor (model){
    super();
    
    this.model = model;
    this.node = null;
    this.html = null;
  }

  _buildCheckbox (name, required) {
    const node = document.createElement('input');
    node.setAttribute('id', name);
    node.setAttribute('type', 'checkbox');
    node.setAttribute('name', name);
    node.setAttribute('value', true);

    if(required){
      node.setAttribute('required', required);
    }

    return node;
  }

  _buildLabel (id, text) {
    const node = document.createElement('label');
    node.setAttribute('for', id);
    node.innerHTML = text;

    return node;
  }


  get value () {
    return this.node.checked ? true : false;
  }

  build (){
    const container = document.createElement('div');
    container.classList.add('af-legal');

    const {id, required} = this.model;
    const {text} = this.model.config;


    const checkbox = this._buildCheckbox(id, required);
    container.appendChild(checkbox);

    const label = this._buildLabel(id, text);
    container.appendChild(label);
    
    this.node = checkbox;
    this.html = container;
  }

  static create (){
    return new Legal(...arguments);
  }

}

module.exports = Legal;
