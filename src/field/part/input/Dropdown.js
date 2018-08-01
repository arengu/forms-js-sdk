const BaseInput = require('./BaseInput');

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
  SELECTED: 'af-selected',
  FILTERED: 'af-filtered',
  ACTIVE: 'af-active',
  DISPLAY: 'af-display'
}

const NO_RESULTS_FOUND = 'No results found';

class Dropdown extends BaseInput {

  constructor(model) {
    super();

    this.model = model;
    this.multiple = model.config.multiple;
    this.dropdown = null;
    this.options = null;
    this.search = null;
    this.searchText = null;
    this.searchOptionsContainer = null;
    this.searchOptions = null;
    this.html = null;
  }

  _buildOption(optionId, value, selected) {
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

    node.onclick = () => {
      node.focus();
    }

    node.onkeyup = () => {
      this.searchText.style.opacity = node.value.length !== 0 ? 0 : 0.5;
      this.searchText.style.zIndex = node.value.length !== 0 ? -1 : 1;

      node.style.width = `${(node.value.length + 2) * 8}px`;

      if (node.value.length !== 0) {
        this._showSearchOptions();
      }

      this._filterSearchOptions(node);
    };

    node.onfocus = () => {
      this.searchText.style.opacity = 0.5;

      const activeOption = this.html.querySelector(`a.${CLASSES.ACTIVE}`);
      if (activeOption) {
        activeOption.classList.remove(CLASSES.ACTIVE);
      }

      this._showSearchOptions();
    }

    node.onblur = () => {
      this.searchText.style.opacity = 1;
      this.searchText.style.zIndex = 1;
      this.search.style.width = '2em';

      node.value = null;
      this._filterSearchOptions(node);

      this._hideSearchOptions();
    }

    node.onkeydown = (e) => {

      if (e.keyCode === KEY_CODE.DELETE ||
        e.keyCode === KEY_CODE.BACKSPACE &&
        this.multiple) {
        const selectedOptions = this.html.querySelectorAll('a');
        const selectedOptionsLength = selectedOptions ? selectedOptions.length : null;
        const activeOption = this.html.querySelector(`a.${CLASSES.ACTIVE}`);
        const caretPosition = e.target.selectionStart;

        if (selectedOptionsLength && caretPosition === 0) {
          const index = activeOption ? activeOption.getAttribute('af-dropdown-index') : selectedOptions.length - 1;
          this._unselectDropdownOption(index);
          if(activeOption && activeOption.nextElementSibling.getAttribute('af-dropdown-index')){
            activeOption.nextElementSibling.classList.add(CLASSES.ACTIVE);
          }
          activeOption ? activeOption.remove() : selectedOptions[index].remove();
          this._removeMessage();
          this._showSearchOptions();
        }
      }

      if (e.keyCode === KEY_CODE.ESCAPE) {
        this._hideSearchOptions();
      }

      if (e.keyCode === KEY_CODE.ENTER) {
        e.preventDefault();
        let indexOption;
        const findSelected = this.searchOptions.find((e, index) => {
          indexOption = index;
          return e.classList.value.includes(CLASSES.SELECTED);
        });
        if (findSelected) {
          const value = findSelected.innerText;

          if (!this.multiple) {
            this._setSearchText(value);
            this._hideSearchOptions();
            this.search.blur();
          }

          this._nextUntil(findSelected, CLASSES.FILTERED, CLASSES.ACTIVE, CLASSES.SELECTED);
          this._selectDropdownOption(indexOption, value);
        }
      }

      if (e.keyCode === KEY_CODE.DOWN_ARROW) {
        const selected = this.searchOptionsContainer.querySelector(`.${CLASSES.SELECTED}`);
        if (!selected) {
          const findNode = this.searchOptions.find((e) => {
            return !e.classList.value.includes(CLASSES.FILTERED) && !e.classList.value.includes(CLASSES.ACTIVE);
          });
          if (findNode) {
            findNode.classList.add(CLASSES.SELECTED);
            this._scrollOptionsMenu();
          }
        } else {
          this._nextUntil(selected, CLASSES.FILTERED, CLASSES.ACTIVE, CLASSES.SELECTED);
          this._scrollOptionsMenu();
        }
      }

      if (e.keyCode === KEY_CODE.UP_ARROW) {
        const selected = this.searchOptionsContainer.querySelector(`.${CLASSES.SELECTED}`);
        if (selected) {
          this._prevUntil(selected, CLASSES.FILTERED, CLASSES.ACTIVE, CLASSES.SELECTED);
          this._scrollOptionsMenu();
        }
      }

      if (e.keyCode === KEY_CODE.LEFT_ARROW) {
        let caretPosition = e.target.selectionStart;
        if(caretPosition === 0){
          const activeOption = this.html.querySelector(`a.${CLASSES.ACTIVE}`);
          const selectedOptions = this.html.querySelectorAll('a');
          if (activeOption) {
            const prev = activeOption.previousElementSibling;
            if(prev.getAttribute('af-dropdown-index')){
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

      if (e.keyCode === KEY_CODE.RIGHT_ARROW) {
        const caretPosition = e.target.selectionStart;
        const activeOption = this.html.querySelector(`a.${CLASSES.ACTIVE}`);
        if (caretPosition === 0 && activeOption) {
          e.preventDefault();
          const next = activeOption.nextElementSibling;
          activeOption.classList.remove(CLASSES.ACTIVE);
          if(next.getAttribute('af-dropdown-index')){
            next.classList.add(CLASSES.ACTIVE);
          }
        }
      }

    }

    return node;
  }

  _scrollOptionsMenu(){
    const menuScroll = this.searchOptionsContainer.scrollTop;
    const item = this.searchOptionsContainer.querySelector(`.${CLASSES.SELECTED}`);
    const itemOffset = item.offsetTop;
    const itemHeight = item.offsetHeight;
    const menuHeight = this.searchOptionsContainer.offsetHeight;
    const offset = menuHeight + menuScroll - itemOffset - itemHeight;
    if (offset < 0){
      this.searchOptionsContainer.scrollTop = menuScroll - offset;
    }
    if(itemOffset < menuScroll){
      this.searchOptionsContainer.scrollTop = itemOffset;
    }
  }

  _buildSearchOption(indexOption, value, selected) {
    const node = document.createElement('div');
    node.innerText = value;

    if (selected && this.multiple) {
      node.classList.add(CLASSES.ACTIVE);
    }

    node.onmousedown = (e) => {
      e.preventDefault();

      if (!this.multiple) {
        this._setSearchText(value);
        this._hideSearchOptions();
        this.search.blur();
      }

      this._selectDropdownOption(indexOption, value);
    };

    return node;
  }

  _buildDropdownIcon() {
    const node = document.createElement('i');
    node.classList.add('af-dropdown-icon');

    node.onmousedown = (e) => {
      e.preventDefault();
      const classes = this.searchOptionsContainer.classList.value;
      classes.includes(CLASSES.DISPLAY) ? this._hideSearchOptions() : this._showSearchOptions();
    }

    const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    icon.setAttribute('viewBox', '0 0 451.847 451.847');
    icon.setAttribute('width', '100%');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M225.923,354.706c-8.098,0-16.195-3.092-22.369-9.263L9.27,151.157c-12.359-12.359-12.359-32.397,0-44.751 c12.354-12.354,32.388-12.354,44.748,0l171.905,171.915l171.906-171.909c12.359-12.354,32.391-12.354,44.744,0 c12.365,12.354,12.365,32.392,0,44.751L248.292,345.449C242.115,351.621,234.018,354.706,225.923,354.706z');
    icon.appendChild(path);

    node.appendChild(icon);

    return node;
  }

  _unselectDropdownOption(indexOption) {
    const node = this.dropdown;
    node.options[indexOption].selected = false;

    this.searchOptions[indexOption].classList.remove(CLASSES.ACTIVE);
    this.searchOptions[indexOption].classList.remove(CLASSES.FILTERED);
    this.searchOptions[indexOption].classList.remove(CLASSES.SELECTED);

    return node;
  }

  _selectDropdownOption(indexOption, value) {
    const node = this.dropdown;
    node.options[indexOption].selected = true;

    for (let key in this.searchOptions) {
      const classes = this.searchOptions[key].classList;
      if (key == indexOption) {
        if (this.multiple) {
          classes.add(CLASSES.ACTIVE);
          classes.add(CLASSES.FILTERED);
          classes.remove(CLASSES.SELECTED);
        } else if (!this.multiple) {
          classes.remove(CLASSES.ACTIVE);
        }
      }
    }

    if (this.multiple) {
      this._selectDropdownMultipleOption(indexOption, value);
    }

    return node;
  }

  _buildSelectedOption(indexOption, value) {
    const node = document.createElement('a');
    node.setAttribute('af-dropdown-index', indexOption);
    node.innerText = value;

    node.onclick = () => {
      const activeOption = this.html.querySelector(`a.${CLASSES.ACTIVE}`);
      if (activeOption) {
        activeOption.classList.remove(CLASSES.ACTIVE);
      }
      node.classList.add(CLASSES.ACTIVE);
    }

    const icon = document.createElement('i');
    icon.classList.add('af-dropdown-option-delete');
    icon.innerHTML = '×';

    node.appendChild(icon);

    icon.onclick = () => {
      this._unselectDropdownOption(indexOption);
      node.remove();
      this._removeMessage();
      this._showSearchOptions();
    }

    return node;
  }

  _selectDropdownMultipleOption(indexOption, value) {
    const node = this._buildSelectedOption(indexOption, value);

    this.html.insertBefore(node, this.search);

    this.search.value = '';
    this._filterSearchOptions(this.search);

    const activeOptions = this.searchOptionsContainer.querySelectorAll(`.${CLASSES.ACTIVE}`);

    if (activeOptions.length == this.searchOptions.length) {
      this._hideSearchOptions();
    }

    return node;
  }

  _buildSearchText() {
    const { placeholder, config: { defaultValue } } = this.model;

    const node = document.createElement('div');
    node.classList.add('af-dropdown-search-text');

    if (placeholder && !defaultValue) {
      node.innerText = placeholder;
      node.classList.add('af-default');
    }

    if (defaultValue && !this.multiple) {
      node.innerText = defaultValue;
    }

    node.onmousedown = (e) => {
      e.preventDefault();
      this.search.focus();      
    }

    return node;
  }

  _setSearchText(value) {
    const node = this.searchText;
    node.classList.remove('af-default');
    node.innerText = value;

    return node;
  }

  _buildMessage() {
    const node = document.createElement('div');
    node.classList.add('af-dropdown-message');
    node.innerText = NO_RESULTS_FOUND;

    return node;
  }

  _doesMessageExists() {
    const node = this.searchOptionsContainer.querySelector('.af-dropdown-message');

    return node ? true : false;
  }

  _removeMessage() {
    const node = this.searchOptionsContainer.querySelector('.af-dropdown-message');

    if (node) {
      node.remove();
    }

    return node;
  }

  _filterSearchOptions(node) {
    const searchValue = node.value.toLowerCase();

    for (let key in this.searchOptions) {
      const searchOptionValue = this.searchOptions[key].innerText.toLowerCase();
      if (!searchOptionValue.includes(searchValue)) {
        this.searchOptions[key].classList.add(CLASSES.FILTERED);
      } else if (!this.searchOptions[key].classList.value.includes(CLASSES.ACTIVE)) {
        this.searchOptions[key].classList.remove(CLASSES.FILTERED);
      }
    }

    const messageExits = this._doesMessageExists();
    const filteredOptions = this.searchOptionsContainer.querySelectorAll(`.${CLASSES.FILTERED}`);

    if (filteredOptions.length === this.searchOptions.length) {
      if (!messageExits) {
        const message = this._buildMessage();
        this.searchOptionsContainer.appendChild(message);
        this._showSearchOptions();
      }
    } else {
      this._removeMessage();
    }

  }

  _hideSearchOptions() {
    const node = this.searchOptionsContainer;
    node.classList.remove(CLASSES.DISPLAY);

    const active = this.html.querySelector(`a.${CLASSES.ACTIVE}`);
    if (active) {
      active.classList.remove(CLASSES.ACTIVE);
    }

    return node;
  }

  _showSearchOptions() {
    const node = this.searchOptionsContainer;
    node.classList.add(CLASSES.DISPLAY);

    this.search.focus();

    return node;
  }

  _prevUntil(selectedElement, filterClass, secondFilterClass, selectedClass) {
    let current = selectedElement;

    while (current.previousElementSibling) {
      current = current.previousElementSibling;
      if (!current.classList.value.includes(filterClass) &&
          !current.classList.value.includes(secondFilterClass)) {
        current.classList.add(selectedClass);
        selectedElement.classList.remove(selectedClass);
        break;
      }
    }
  }

  _nextUntil(selectedElement, filterClass, secondFilterClass, selectedClass) {
    let current = selectedElement;

    while (current.nextElementSibling) {
      current = current.nextElementSibling;
      if (!current.classList.value.includes(filterClass) &&
          !current.classList.value.includes(secondFilterClass)) {
        current.classList.add(selectedClass);
        selectedElement.classList.remove(selectedClass);
        break;
      }
    }
  }

  /*
   * View actions
   */
  get value() {
    let result = this.options.filter((o) => o.selected).map((o) => o.value);

    return this.multiple ? result : result[0];
  }

  build() {
    const container = document.createElement('div');
    container.classList.add('af-dropdown');

    if (this.multiple) {
      container.classList.add('af-dropdown-multiple');
    }

    container.onmousedown = (e) => {
      if(this.multiple){
        e.preventDefault();
        this.search.focus();
      }
    }

    container.ontouchstart = (e) => {
      if(this.multiple){
        e.preventDefault();
        this.search.focus();
      }
    }

    const dropdown = document.createElement('select');
    container.appendChild(dropdown);

    const { validValues, defaultValue } = this.model.config;
    const { id, uid, placeholder } = this.model;

    dropdown.setAttribute('name', id);
    dropdown.setAttribute('id', id);
    dropdown.setAttribute('tabindex', '-1');

    if (this.multiple) {
      dropdown.setAttribute('multiple', 'multiple');
    }

    if (this.model.required) {
      dropdown.setAttribute('required', true);
    }

    const options = validValues
    .map((value, i) => {
      const optionId = `${uid}-${i}`;
      const selected = defaultValue && defaultValue.includes(value);
      return this._buildOption(optionId, value, selected);
    });

    options.forEach((n) => dropdown.appendChild(n));

    if (placeholder && !defaultValue && !this.multiple) {
      dropdown.value = null;
    }

    const search = this._buildSearch(this.model);
    container.appendChild(search);

    const icon = this._buildDropdownIcon();
    container.appendChild(icon);

    const searchText = this._buildSearchText();
    container.appendChild(searchText);
    this.searchText = searchText;

    const searchOptionsContainer = document.createElement('div');
    searchOptionsContainer.classList.add('af-dropdown-search-options');
    container.appendChild(searchOptionsContainer);

    const searchOptions = validValues
    .map((value, indexOption) => {
      const selected = defaultValue && defaultValue.includes(value);
      if(selected && this.multiple){
        const selectedOption = this._buildSelectedOption(indexOption, value);
        container.insertBefore(selectedOption, search);
      }
      return this._buildSearchOption(indexOption, value, selected);
    });

    searchOptions.forEach((n) => searchOptionsContainer.appendChild(n));

    this.dropdown = dropdown;
    this.options = options;
    this.search = search;
    this.searchOptionsContainer = searchOptionsContainer;
    this.searchOptions = searchOptions;
    this.html = container;
  }

  static create() {
    return new Dropdown(...arguments);
  }

}

module.exports = Dropdown;
