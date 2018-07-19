const BaseInput = require('./BaseInput');
const RatingIcons = require('./RatingIcons');

class Rating extends BaseInput {

  constructor (model) {
    super();

    this.model = model;
    this.nodes = null;
    this.html = null;
    this._value = null;
  }

 /*
  * Internal Methods
  */
  
  _buildOptions (type, numberOfButton) {
    const rateButtons = [];

    for( let i = 1; i <= numberOfButton ; i++) {
      const container = document.createElement('div');
      container.classList.add('af-rating-option');

      const label = this._buildLabel(type, i);
      container.appendChild(label);
      rateButtons.push(container);
    }

    return rateButtons;
  }

  _buildIcon (type) {
    return RatingIcons.render(type);
  }
  
  _buildLabel (type , value) {
    const node = document.createElement('label');
    node.onclick = () => this.setValue(value);

    const icon = this._buildIcon(type);
    node.appendChild(icon);

    return node;
  }

  setValue (value) {
    const numChecked = value;
    this._value = value;

    this.nodes.slice(0 ,numChecked).forEach((n) => n.classList.add('af-checked'));
    this.nodes.slice(numChecked).forEach((n) => n.classList.remove('af-checked'));
  }

  get value () {
    return this._value;
  }

  build () {
    const container = document.createElement('div');
    container.classList.add('af-rating');

    const {maxValue, icon} = this.model.config;
    const rateButtons = this._buildOptions(icon, maxValue);

    rateButtons.forEach((b) => container.appendChild(b));

    this.nodes = rateButtons;
    this.html = container;
  }

  static create (){
    return new Rating(...arguments);
  }

}

module.exports = Rating;
