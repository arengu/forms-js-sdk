const BaseView = require('../../../base/BaseView');
const RatingIcons = require('./RatingIcons');

class Rating extends BaseView{

  constructor (model) {
    super();

    this.model = model;
    this.nodes = null;
    this.html = null;
    this._value = 0;
    
  }

 /*
  * Internal Methods
  */
  
  _buildOptions (type, numberOfButton){
    const rateButtons = [];

    for(let i = 1; i <= numberOfButton ; i++){
      const container = document.createElement('div');
      container.classList.add('af-rating-option');

      const label = this._buildLabel(type, i);
      container.appendChild(label);
      rateButtons.push(container);
    }

    return rateButtons;
  }

  _buildIcon(type){
    return RatingIcons.render(type);
  }
  
  _buildLabel (type , value){
    const node = document.createElement('label');
    const icon = this._buildIcon(type);
    node.appendChild(icon);
    node.onclick = () => {
      this.setValue(value);
    };

    return node;
  }

  setValue(value){
    const numChecked = value;
    this._value = value;

    this.nodes.slice(0 ,numChecked).forEach( (n) => n.classList.add('af-checked'));
    this.nodes.slice(numChecked).forEach( (n) => n.classList.remove('af-checked'));
  }

  get value () {
    return this._value;
  }

  build (){
    const container = document.createElement('div');
    container.classList.add('af-rating');

    const {maxValue, icon} = this.model.config;
    let rateButtons;

    rateButtons = this._buildOptions(icon, maxValue);

    for(let button of rateButtons){
      container.appendChild(button);
    }

    this.nodes = rateButtons;
    this.html = container;
  }

  static create (){
    return new Rating(...arguments);
  }

}

module.exports = Rating;