// js/autocomplete.js — Prefix-filtered dropdown widget

import { getCountryNamesForAutocomplete } from './data.js';

let dropdown = null;
let input = null;
let items = [];
let activeIndex = -1;
let guessedIds = new Set();
let onSelect = null;

/**
 * Initialize autocomplete on the given input element.
 * onSelectCb(name) is called when user picks a suggestion.
 */
export function init(inputEl, dropdownEl, onSelectCb) {
  input = inputEl;
  dropdown = dropdownEl;
  onSelect = onSelectCb;

  input.addEventListener('input', onInput);
  input.addEventListener('keydown', onKeydown);
  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target) && e.target !== input) {
      hide();
    }
  });
}

export function updateGuessed(newGuessedIds) {
  guessedIds = newGuessedIds;
}

function onInput() {
  const val = input.value.trim().toLowerCase();
  if (val.length < 1) {
    hide();
    return;
  }
  const countries = getCountryNamesForAutocomplete(guessedIds);
  items = countries
    .filter(c => c.name.toLowerCase().startsWith(val))
    .slice(0, 8);

  if (items.length === 0) {
    // Also try substring match
    const substr = countries
      .filter(c => c.name.toLowerCase().includes(val))
      .slice(0, 8);
    items = substr;
  }

  if (items.length === 0) {
    hide();
    return;
  }

  activeIndex = -1;
  render();
  dropdown.classList.add('visible');
}

function onKeydown(e) {
  if (!dropdown.classList.contains('visible')) return;

  if (e.key === 'ArrowDown') {
    e.preventDefault();
    activeIndex = Math.min(activeIndex + 1, items.length - 1);
    render();
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    activeIndex = Math.max(activeIndex - 1, 0);
    render();
  } else if (e.key === 'Enter' && activeIndex >= 0) {
    e.preventDefault();
    selectItem(items[activeIndex]);
  } else if (e.key === 'Escape') {
    hide();
  }
}

function selectItem(item) {
  input.value = item.name;
  hide();
  if (onSelect) onSelect(item.name);
}

function render() {
  dropdown.innerHTML = '';
  items.forEach((item, i) => {
    const div = document.createElement('div');
    div.className = 'ac-item' + (i === activeIndex ? ' active' : '');
    div.innerHTML = `
      <span class="ac-name">${highlight(item.name, input.value.trim())}</span>
      <span class="ac-region">${item.region}</span>
    `;
    div.addEventListener('mousedown', (e) => {
      e.preventDefault();
      selectItem(item);
    });
    div.addEventListener('mouseenter', () => {
      activeIndex = i;
      render();
    });
    dropdown.appendChild(div);
  });
}

function highlight(name, query) {
  const idx = name.toLowerCase().indexOf(query.toLowerCase());
  if (idx < 0) return name;
  const before = name.slice(0, idx);
  const match = name.slice(idx, idx + query.length);
  const after = name.slice(idx + query.length);
  return `${before}<strong>${match}</strong>${after}`;
}

export function hide() {
  if (dropdown) {
    dropdown.classList.remove('visible');
    dropdown.innerHTML = '';
  }
  items = [];
  activeIndex = -1;
}

export function clear() {
  if (input) input.value = '';
  hide();
}
