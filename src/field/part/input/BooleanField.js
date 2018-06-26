const BaseView = require('../../../base/BaseView');

class BooleanField extends BaseView {
    
  constructor (model) {
    super();

    this.model = model;
    this.nodes = null;
    this.html = null;
  }

  _buildLabel (text , id){
    const node = document.createElement('label');
    node.setAttribute('for', id);
    node.innerText = text;

    return node;
  }

  _buildOption(id, name, value, required, text){
    const container = document.createElement('div');
    container.classList.add('af-boolean-option');
    const radio = document.createElement('input');

    radio.setAttribute('id', id);
    radio.setAttribute('type', 'radio');
    radio.setAttribute('name', name);
    radio.setAttribute('value', value);

    if(required){
      radio.setAttribute('required', required);
    }

    container.appendChild(radio);
    container.appendChild(this._buildLabel(text, id));

    return container;
  }

  _buildInputs(id, required){
    const nodes = [];

    nodes.push(this._buildOption(`${id}-1`,id,true,required,"Yes"));
    nodes.push(this._buildOption(`${id}-2`,id,false,required,"No"));

    return nodes;
  }

  get value () {
    return this.nodes.filter((node) => node.checked ).map((node) => node.value)[0] === 'true' ? true : false;
  }

  build (){
    const container = document.createElement('div');
    container.classList.add('af-boolean');

    const {id, required} = this.model;
    
    const nodes = this._buildInputs(id, required);

    for(let node of nodes){
      container.appendChild(node);
    }

    this.nodes = nodes.reduce((arr, node ) => {
      arr.push(node.querySelector('input'));
      return arr;
    },[]);

    this.html = container;
  }

  static create (){
    return new BooleanField(...arguments);
  }
}

module.exports = BooleanField;