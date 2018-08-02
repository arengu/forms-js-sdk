const BaseView = require('../base/BaseView')

const KEY_CODE = {
  LEFT_ARROW: 37,
  UP_ARROW: 38,
  RIGHT_ARROW: 39,
  DOWN_ARROW: 40,
  ESCAPE: 27,
  ENTER: 13,
  BACKSPACE: 8,
  DELETE: 46,

}

const CLASSES = {
  HOVER: 'af-hover',
  FILTERED: 'af-filtered',
  ACTIVE: 'af-active',
  DISPLAY: 'af-display'
}

const INDEX_ATTRIBUTE = 'data-af-dropdown-index';

const NO_RESULTS_FOUND = 'No results found';

class CustomDropdown extends BaseView {

  constructor(model) {
    super();

    this.model = model;
    this.multiple = model.config.multiple;
    this.hiddenDropdown = null;
    this.hiddenDropdownOptions = null;
    this.dropdown = null;
    this.dropdownOptions = null;
    this.search = null;
    this.dropdownText = null;
    this.html = null;
  }

  _buildHiddenDropdown() {
    const node = document.createElement('select');

    const { id } = this.model;

    node.setAttribute('name', id);
    node.setAttribute('id', id);
    node.setAttribute('tabindex', '-1');

    if (this.multiple) {
      node.setAttribute('multiple', 'multiple');
    }

    if (this.model.required) {
      node.setAttribute('required', true);
    }

    return node;
  }

  _buildHiddenDropdownOptions() {
    const { validValues, defaultValue } = this.model.config;
    const { uid } = this.model;

    const node = validValues
    .map((value, i) => {
      const optionId = `${uid}-${i}`;
      const selected = defaultValue && defaultValue.includes(value);
      return this._buildHiddenDropdownOption(optionId, value, selected);
    });

    return node;
  }

  _buildHiddenDropdownOption(optionId, value, selected) {
    const node = document.createElement('option');
    node.setAttribute('id', optionId);
    node.setAttribute('value', value);
    node.innerText = value;

    if (selected) {
      node.setAttribute('selected', 'true');
    }

    return node;
  }

  _buildSearch() {
    const node = document.createElement('input');
    node.classList.add('af-dropdown-search');
    node.setAttribute('type', 'search');
    node.setAttribute('autocomplete', 'off');

    this._addSearchListeners(node);

    return node;
  }

  _addSearchListeners(node) {

    const self = this;

    node.onfocus = function () {
      self._showDropdownOptions();
      self.dropdownText.style.opacity = '0.5';
    }

    node.onblur = function () {
      self._hideDropdownOptions();
      self._showDropdownText();
      node.value = null;
      self._filterDropdownOptions(node);
      self.dropdownText.style.opacity = '1';
    }

    node.onkeyup = function () {
      self._filterDropdownOptions(node);
    };

    node.onkeydown = function (e) {
      self._autoResize(node);
      self._hideDropdownText();

      switch(e.keyCode){
        case KEY_CODE.DELETE:
        case KEY_CODE.BACKSPACE:
          return self._removeDropdownTag(e);
        case KEY_CODE.ESCAPE:
          return node.blur();
        case KEY_CODE.ENTER:
          return self._selectHoverDropdownOption(e);
        case KEY_CODE.DOWN_ARROW:
          return self._hoverNextDropdownOption();
        case KEY_CODE.UP_ARROW:
          return self._hoverPrevDropdownOption();
        case KEY_CODE.LEFT_ARROW:
          return self._hoverPrevDropdownTag(e);
        case KEY_CODE.RIGHT_ARROW:
          return self._hoverNextDropdownTag(e);
      }
    };
  }

  _hoverPrevDropdownTag(e) {
    let caretPosition = e.target.selectionStart;
    if(caretPosition === 0){
      const activeOption = this.html.querySelector(`a.${CLASSES.ACTIVE}`);
      const selectedOptions = this.html.querySelectorAll('a');
      if (activeOption) {
        const prev = activeOption.previousElementSibling;
        if(prev.getAttribute(INDEX_ATTRIBUTE)){
          activeOption.classList.remove(CLASSES.ACTIVE);
          prev.classList.add(CLASSES.ACTIVE);
        }
      } else if (selectedOptions.length > 0) {
        selectedOptions[selectedOptions.length - 1].classList.add(CLASSES.ACTIVE);
      }
    } else {
      caretPosition--;
    }
  }

  _hoverNextDropdownTag(e) {
    const caretPosition = e.target.selectionStart;
    const activeOption = this.html.querySelector(`a.${CLASSES.ACTIVE}`);
    if (caretPosition === 0 && activeOption) {
      e.preventDefault();
      const next = activeOption.nextElementSibling;
      activeOption.classList.remove(CLASSES.ACTIVE);
      if(next.getAttribute(INDEX_ATTRIBUTE)){
        next.classList.add(CLASSES.ACTIVE);
      }
    }
  } 

  _selectHoverDropdownOption(e) {
    e.preventDefault();
    const hover = this.dropdown.querySelector(`.${CLASSES.HOVER}`);

    if (hover) {
      const index = hover.getAttribute(INDEX_ATTRIBUTE);
      const value = hover.innerText;
      
      if(!this.multiple) {
        this._setDropdownText(value);
      }

      this._prevAvailableDropdownOption(hover);
      this._selectDropdownOption(index, value);
    }
  } 

  _hoverNextDropdownOption() {
    const hover = this.dropdown.querySelector(`.${CLASSES.HOVER}`);

    if (hover) {
      this._nextAvailableDropdownOption(hover);
      this._scrollDropdownOptions();
    } else {
      const findNode = this.dropdownOptions.find((e) => {
        return !e.classList.value.includes(CLASSES.FILTERED)
          && !e.classList.value.includes(CLASSES.ACTIVE);
      });
      if (findNode) {
        findNode.classList.add(CLASSES.HOVER);
        this._scrollDropdownOptions();
      }
    }
  }
  
  _hoverPrevDropdownOption() {
    const hover = this.dropdown.querySelector(`.${CLASSES.HOVER}`);

    if (hover) {
      this._prevAvailableDropdownOption(hover);
      this._scrollDropdownOptions();
    }
  }

  _removeHoverDropdownOption() {
    const hover = this.dropdown.querySelector(`.${CLASSES.HOVER}`);

    if (hover) {
      hover.classList.remove(CLASSES.HOVER);
    }
  }

  _scrollDropdownOptions(){
    const menuScroll = this.dropdown.scrollTop;
    const menuHeight = this.dropdown.offsetHeight;
    const item = this.dropdown.querySelector(`.${CLASSES.HOVER}`);
    const itemOffset = item.offsetTop;
    const itemHeight = item.offsetHeight;
    const offset = menuHeight + menuScroll - itemOffset - itemHeight;
    if (offset < 0){
      this.dropdown.scrollTop = menuScroll - offset;
    }
    if(itemOffset < menuScroll){
      this.dropdown.scrollTop = itemOffset;
    }
  }

  _showDropdownText() {
    const node = this.dropdownText;
    node.style.display = 'inline-block';

    return node;
  }

  _hideDropdownText() {
    const node = this.dropdownText;
    node.style.display = 'none';

    return node;
  }

  _autoResize(node) {
    return node.style.width = `${(node.value.length + 2) * 8}px`;
  }

  _removeDropdownTag(e) {
    const selectedOptions = this.html.querySelectorAll('a');
    const activeOption = this.html.querySelector(`a.${CLASSES.ACTIVE}`);
    const caretPosition = e.target.selectionStart;

    if (activeOption) {
      const index = activeOption.getAttribute(INDEX_ATTRIBUTE)
      this._unselectDropdownOption(index);
      const nextIndex = activeOption.nextElementSibling.getAttribute(INDEX_ATTRIBUTE);
      if(activeOption && nextIndex){
        activeOption.nextElementSibling.classList.add(CLASSES.ACTIVE);
      }
      activeOption.remove();
      this._showDropdownOptions();
    }

    if (selectedOptions.length && caretPosition === 0 && !activeOption) {
      const index = selectedOptions[selectedOptions.length - 1].getAttribute(INDEX_ATTRIBUTE);
      this._unselectDropdownOption(index);
      selectedOptions[selectedOptions.length - 1].remove();
    }
  }

  _buildDropdownText() {
    const { placeholder, config: { defaultValue } } = this.model;

    const node = document.createElement('div');
    node.classList.add('af-dropdown-text');

    if (placeholder) {
      node.innerText = placeholder;
      node.classList.add('af-default');
    }

    if (defaultValue && !this.multiple) {
      node.innerText = defaultValue;
      node.classList.remove('af-default');
    }

    this._addDropdownTextListeners(node);

    return node;
  }

  _addDropdownTextListeners(node) {
    const self = this;

    node.onmousedown = function (e) {
      e.preventDefault();
      self.search.focus();
    };
  }

  _setDropdownText(value) {
    const node = this.dropdownText;
    node.classList.remove('af-default');
    node.innerText = value;

    return node;
  }

  _buildDropdown() {
    const node = document.createElement('div');
    node.classList.add('af-dropdown-search-options');

    return node;
  }

  _buildDropdownOptions(search, container) {
    const { validValues, defaultValue } = this.model.config;

    const node = validValues
    .map((value, i) => {
      const selected = defaultValue && defaultValue.includes(value);
      return this._buildDropdownOption(i, value, selected, search, container);
    });

    return node;
  }

  _buildDropdownOption(i, value, selected, search, container) {
    const node = document.createElement('div');
    node.innerText = value;

    if (selected && this.multiple) {
      node.classList.add(CLASSES.ACTIVE);

      const tag = this._buildDropdownOptionTag(i, value);
      container.insertBefore(tag, search);
    }

    node.setAttribute(INDEX_ATTRIBUTE, i);

    this._addDropdownOptionListeners(node);

    return node;
  }

  _addDropdownOptionListeners(node) {

    node.onmousedown = (e) => {
      e.preventDefault();

      const value = node.innerText;
      const index = node.getAttribute(INDEX_ATTRIBUTE);

      if(!this.multiple) {
        this._setDropdownText(value);
        this._hideDropdownOptions();
      }

      this._selectDropdownOption(index, value);
    }

  }

  _buildDropdownIcon() {
    const node = document.createElement('i');
    node.classList.add('af-dropdown-icon');

    const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    icon.setAttribute('viewBox', '0 0 451.847 451.847');
    icon.setAttribute('width', '100%');

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M225.923,354.706c-8.098,0-16.195-3.092-22.369-9.263L9.27,151.157c-12.359-12.359-12.359-32.397,0-44.751 c12.354-12.354,32.388-12.354,44.748,0l171.905,171.915l171.906-171.909c12.359-12.354,32.391-12.354,44.744,0 c12.365,12.354,12.365,32.392,0,44.751L248.292,345.449C242.115,351.621,234.018,354.706,225.923,354.706z');
    icon.appendChild(path);

    node.appendChild(icon);

    this._addDropdownIconListeners(node);

    return node;
  }

  _addDropdownIconListeners(node) {
    const self = this;
    node.onmousedown = function (e) {
      e.preventDefault();

      const classes = self.dropdown.classList.value;

      classes.includes(CLASSES.DISPLAY)
        ? self._hideDropdownOptions()
        : self._showDropdownOptions();

      self.search.focus();
    };
  }


  _selectDropdownOption(index, value) {
    const node = this.hiddenDropdown;

    node.options[index].selected = true;

    if(this.multiple) {
      const tag = this._buildDropdownOptionTag(index, value);
      this.html.insertBefore(tag, this.search);
    } else {
      this.search.blur();
    }

    this._addActiveDropdownOptionClass(index);
    this._checkAllDropdownOptionsSelected();

    return node;
  }

  _checkAllDropdownOptionsSelected() {
    const activeOptions = this.dropdown.querySelectorAll(`.${CLASSES.ACTIVE}`);

    if (activeOptions.length == this.dropdownOptions.length) {
      this.search.blur();
    }
  }

  _addActiveDropdownOptionClass(index) {
    if(!this.multiple) {
      const activeOption = this.dropdown.querySelector(`.${CLASSES.ACTIVE}`);
      const activeOptionIndex = activeOption ? activeOption.getAttribute(INDEX_ATTRIBUTE) : null;
      if (activeOptionIndex) {
        this._removeActiveDropdownOptionClass(activeOptionIndex)
      }
    }

    const node = this.dropdown.querySelector(`[${INDEX_ATTRIBUTE}="${index}"]`);
    node.classList.add(CLASSES.ACTIVE, CLASSES.FILTERED);
    node.classList.remove(CLASSES.HOVER);

    return node;
  }

  _removeActiveDropdownOptionClass(index) {
    const node = this.dropdown.querySelector(`[${INDEX_ATTRIBUTE}="${index}"]`);
    node.classList.remove(CLASSES.ACTIVE, CLASSES.FILTERED);

    return node;
  }

  _buildDropdownOptionTag(index, value) {
    const node = document.createElement('a');
    node.setAttribute(INDEX_ATTRIBUTE, index);
    node.innerText = value;

    const icon = document.createElement('i');
    icon.classList.add('af-dropdown-option-delete');
    icon.innerHTML = '×';

    node.appendChild(icon);

    this._addDropdownOptionTagListeners(node, icon);

    return node;
  }

  _addDropdownOptionTagListeners(node, icon) {
    const self = this;

    node.onmousedown = (e) => {
      e.preventDefault();
    }

    node.onclick = () => {
      self._setActiveDropdownTag(node);
    }

    icon.onclick = () => {
      const index = node.getAttribute(INDEX_ATTRIBUTE);
      const noResultsMessage = this._doesNoResultsMessageExists();

      self._unselectDropdownOption(index);
      node.remove();

      if (noResultsMessage) {
        this._removeNoResultsMessage();
      } 
    }
  }

  _setActiveDropdownTag(node) {
    const activeTag = this.html.querySelector(`a.${CLASSES.ACTIVE}`);

    if(activeTag) {
      activeTag.classList.remove(CLASSES.ACTIVE)
    }
    
    return node.classList.add(CLASSES.ACTIVE);
  }

  _filterDropdownOptions(node) {
    const input = node.value.toLowerCase();
    const options = this.dropdownOptions;

    options
    .map((value, i) => {
      const optionValue = value.innerText.toLowerCase();

      if(!optionValue.includes(input)) {
        return options[i].classList.add(CLASSES.FILTERED);
      } else if (!options[i].classList.value.includes(CLASSES.ACTIVE)) {
        return options[i].classList.remove(CLASSES.FILTERED);
      }
    });

    const filteredOptions = this.dropdown.querySelectorAll(`.${CLASSES.FILTERED}`);
    const noResultsMessage = this._doesNoResultsMessageExists();

    if (!noResultsMessage && filteredOptions.length === options.length) {
      const message = this._buildNoResultsMessage();

      return this.dropdown.appendChild(message);
    }

    if (noResultsMessage && filteredOptions.length !== options.length) {
      return this._removeNoResultsMessage();
    }
  }

  _doesNoResultsMessageExists() {
    const node = this.dropdown.querySelector('.af-dropdown-message');

    return node ? true : false;
  }

  _buildNoResultsMessage() {
    const node = document.createElement('div');
    node.classList.add('af-dropdown-message');
    node.innerText = NO_RESULTS_FOUND;

    return node;
  }

  _removeNoResultsMessage() {
    const node = this.dropdown.querySelector('.af-dropdown-message');

    return node.remove();
  }


  _unselectDropdownOption(index) {
    const node = this.hiddenDropdown;

    node.options[index].selected = false;

    this._removeActiveDropdownOptionClass(index);

    return node;
  }

  _hideDropdownOptions() {
    const node = this.dropdown;
    node.classList.remove(CLASSES.DISPLAY);

    this._removeHoverDropdownOption();

    return node;
  }

  _showDropdownOptions() {
    const node = this.dropdown;
    node.classList.add(CLASSES.DISPLAY);

    return node;
  }

  _nextAvailableDropdownOption(node) {
    let current = node;

    while (current.nextElementSibling) {
      current = current.nextElementSibling;
      if (!current.classList.value.includes(CLASSES.ACTIVE) &&
          !current.classList.value.includes(CLASSES.FILTERED)) {
        current.classList.add(CLASSES.HOVER);
        node.classList.remove(CLASSES.HOVER);
        break;
      }
    }
  }

  _prevAvailableDropdownOption(node) {
    let current = node;

    while (current.previousElementSibling) {
      current = current.previousElementSibling;
      if (!current.classList.value.includes(CLASSES.ACTIVE) &&
          !current.classList.value.includes(CLASSES.FILTERED)) {
        current.classList.add(CLASSES.HOVER);
        node.classList.remove(CLASSES.HOVER);
        break;
      }
    }
  } 

  /*
   * View actions
   */
  get value () {
    const result = this.hiddenDropdownOptions
      .filter((o) => o.selected)
      .map((o) => o.value);

    return this.multiple ? result : result[0];
  }

  get options () {
    return this.hiddenDropdownOptions;
  }

  build () {
    const { config: { defaultValue } } = this.model;

    const container = document.createElement('div');
    container.classList.add('af-dropdown');

    if (this.multiple) {
      container.classList.add('af-dropdown-multiple');
    }

    const self = this;
    
    container.onmousedown = function (e) {
      if(e.target === e.currentTarget) {
        e.preventDefault();
        self.search.focus();
      }
    }

    const hiddenDropdown = this._buildHiddenDropdown();
    container.appendChild(hiddenDropdown);

    const hiddenDropdownOptions = this._buildHiddenDropdownOptions();
    hiddenDropdownOptions.forEach((n) => hiddenDropdown.appendChild(n));

    if (!defaultValue) {
      // We cannot do it before appending children
      hiddenDropdown.value = null;
    }

    const search = this._buildSearch(this.model);
    container.appendChild(search);

    const dropdown = this._buildDropdown();
    container.appendChild(dropdown);

    const dropdownText = this._buildDropdownText();
    container.appendChild(dropdownText);

    const dropdownIcon = this._buildDropdownIcon();
    container.appendChild(dropdownIcon);

    const dropdownOptions = this._buildDropdownOptions(search, container);
    dropdownOptions.forEach((n) => dropdown.appendChild(n));

    this.hiddenDropdown = hiddenDropdown;
    this.hiddenDropdownOptions = hiddenDropdownOptions;
    this.dropdown = dropdown;
    this.dropdownOptions = dropdownOptions;
    this.dropdownText = dropdownText;
    this.search = search;
    this.html = container;
  }

  static create() {
    return new CustomDropdown(...arguments);
  }

}

module.exports = CustomDropdown;
