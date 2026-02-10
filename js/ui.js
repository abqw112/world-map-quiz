// js/ui.js — DOM updates: sidebar, HUD, modals, feedback

import { REGIONS, getRegion, getAllCountryIds, getDisplayName } from './data.js';

// Cache DOM elements
let els = {};

export function cacheDom() {
  els = {
    livesDisplay: document.getElementById('lives-display'),
    scoreDisplay: document.getElementById('score-display'),
    timerDisplay: document.getElementById('timer-display'),
    sidebar: document.getElementById('sidebar-regions'),
    startModal: document.getElementById('start-modal'),
    endModal: document.getElementById('end-modal'),
    guessInput: document.getElementById('guess-input'),
    submitBtn: document.getElementById('submit-btn'),
    inputBar: document.getElementById('input-bar'),
    feedbackEl: document.getElementById('feedback'),
    selectedName: document.getElementById('selected-name'),
    giveUpBtn: document.getElementById('give-up-btn')
  };
}

// --- HUD Updates ---

export function updateScore(correct, total) {
  els.scoreDisplay.textContent = `${correct}/${total}`;
}

export function updateLives(lives, maxLives) {
  if (maxLives === Infinity) {
    els.livesDisplay.textContent = '\u221e';
    return;
  }
  let hearts = '';
  for (let i = 0; i < maxLives; i++) {
    hearts += i < lives ? '\u2764\ufe0f' : '\ud83e\udeb6';
  }
  els.livesDisplay.textContent = hearts;
}

export function updateTimer(elapsedSeconds, timeLimitSeconds) {
  if (timeLimitSeconds > 0) {
    const remaining = Math.max(0, timeLimitSeconds - elapsedSeconds);
    els.timerDisplay.textContent = formatTime(remaining);
    els.timerDisplay.classList.toggle('timer-warning', remaining <= 60);
  } else {
    els.timerDisplay.textContent = formatTime(elapsedSeconds);
  }
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// --- Sidebar ---

export function initSidebar() {
  els.sidebar.innerHTML = '';
  const allIds = getAllCountryIds();

  for (const [regionName, regionData] of Object.entries(REGIONS)) {
    const regionIds = [];
    for (const ids of Object.values(regionData.subregions)) {
      regionIds.push(...ids);
    }
    const total = regionIds.filter(id => allIds.includes(id)).length;

    const div = document.createElement('div');
    div.className = 'region-item';
    div.dataset.region = regionName;
    div.innerHTML = `
      <div class="region-header">
        <span class="region-dot" style="background:${regionData.color}"></span>
        <span class="region-name">${regionName}</span>
        <span class="region-count" data-region-count="${regionName}">0/${total}</span>
      </div>
      <div class="region-bar-track">
        <div class="region-bar-fill" data-region-bar="${regionName}" style="background:${regionData.color};width:0%"></div>
      </div>
    `;
    els.sidebar.appendChild(div);
  }
}

export function updateRegionProgress(guessedCountries) {
  const allIds = getAllCountryIds();

  for (const [regionName, regionData] of Object.entries(REGIONS)) {
    const regionIds = [];
    for (const ids of Object.values(regionData.subregions)) {
      regionIds.push(...ids);
    }
    const total = regionIds.filter(id => allIds.includes(id)).length;
    const guessed = regionIds.filter(id => guessedCountries.has(id)).length;
    const pct = total > 0 ? (guessed / total * 100) : 0;

    const countEl = document.querySelector(`[data-region-count="${regionName}"]`);
    const barEl = document.querySelector(`[data-region-bar="${regionName}"]`);
    if (countEl) countEl.textContent = `${guessed}/${total}`;
    if (barEl) barEl.style.width = `${pct}%`;
  }
}

// --- Modals ---

export function showStartModal(onStart) {
  els.startModal.classList.add('visible');
  els.endModal.classList.remove('visible');

  const startBtn = document.getElementById('start-btn');
  startBtn.onclick = () => {
    const livesVal = document.getElementById('lives-select').value;
    const timeVal = document.getElementById('time-select').value;
    const lives = livesVal === 'inf' ? Infinity : Number(livesVal);
    const timeLimitMinutes = Number(timeVal);
    els.startModal.classList.remove('visible');
    onStart({ lives, timeLimitMinutes });
  };
}

export function showEndModal(result, stats) {
  const modal = els.endModal;
  modal.classList.add('visible');

  document.getElementById('end-title').textContent =
    result === 'won' ? 'Congratulations!' : 'Game Over';
  document.getElementById('end-subtitle').textContent =
    result === 'won' ? 'You named every country!' : 'Better luck next time!';

  document.getElementById('end-score').textContent =
    `${stats.correct}/${stats.total} countries`;
  document.getElementById('end-time').textContent =
    formatTime(stats.elapsedSeconds);

  // Region breakdown
  const breakdown = document.getElementById('end-regions');
  breakdown.innerHTML = '';
  for (const [regionName, regionData] of Object.entries(REGIONS)) {
    const regionIds = [];
    for (const ids of Object.values(regionData.subregions)) {
      regionIds.push(...ids);
    }
    const allIds = getAllCountryIds();
    const total = regionIds.filter(id => allIds.includes(id)).length;
    const guessed = regionIds.filter(id => stats.guessedCountries.has(id)).length;

    const div = document.createElement('div');
    div.className = 'end-region-row';
    div.innerHTML = `
      <span class="region-dot" style="background:${regionData.color}"></span>
      <span>${regionName}</span>
      <span class="end-region-score">${guessed}/${total}</span>
    `;
    breakdown.appendChild(div);
  }
}

export function hideEndModal() {
  els.endModal.classList.remove('visible');
}

// --- Selection & Feedback ---

export function showSelectedCountry(countryId) {
  if (countryId == null) {
    els.selectedName.textContent = 'Click a country on the map';
    els.guessInput.disabled = true;
    els.submitBtn.disabled = true;
    return;
  }
  els.selectedName.textContent = 'Which country is this?';
  els.guessInput.disabled = false;
  els.submitBtn.disabled = false;
  els.guessInput.value = '';
  els.guessInput.focus();
}

export function showFeedback(correct, countryId) {
  const name = getDisplayName(countryId);
  if (correct) {
    els.feedbackEl.textContent = `\u2714 ${name}`;
    els.feedbackEl.className = 'feedback correct';
  } else {
    els.feedbackEl.textContent = `\u2718 Wrong!`;
    els.feedbackEl.className = 'feedback wrong';
    // Shake the input
    els.guessInput.classList.add('shake');
    setTimeout(() => els.guessInput.classList.remove('shake'), 500);
  }
  els.feedbackEl.classList.add('visible');
  setTimeout(() => els.feedbackEl.classList.remove('visible'), 2000);
}

export function enableInput(enabled) {
  els.guessInput.disabled = !enabled;
  els.submitBtn.disabled = !enabled;
  if (!enabled) {
    els.guessInput.value = '';
    els.selectedName.textContent = '';
  }
}

export function getInputValue() {
  return els.guessInput.value;
}

export function clearInput() {
  els.guessInput.value = '';
}

export function focusInput() {
  els.guessInput.focus();
}
