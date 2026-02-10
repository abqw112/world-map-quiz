// js/game.js — Game state management: lives, score, timer, win/loss

import { checkAnswer, getRegion, getAllCountryIds } from './data.js';

const state = {
  status: 'idle', // idle | playing | won | lost
  lives: 3,
  maxLives: 3,
  correctCount: 0,
  totalCountries: 0,
  guessedCountries: new Set(),
  selectedCountryId: null,
  elapsedSeconds: 0,
  timeLimitSeconds: 0, // 0 = no limit
  timerInterval: null,
  // Callbacks set by app.js
  onTimerTick: null,
  onLifeLost: null,
  onCorrectGuess: null,
  onWrongGuess: null,
  onGameEnd: null
};

export function getState() {
  return state;
}

export function init(config = {}) {
  state.status = 'playing';
  state.maxLives = config.lives ?? 3;
  state.lives = state.maxLives;
  state.correctCount = 0;
  state.totalCountries = getAllCountryIds().length;
  state.guessedCountries = new Set();
  state.selectedCountryId = null;
  state.elapsedSeconds = 0;
  state.timeLimitSeconds = config.timeLimitMinutes ? config.timeLimitMinutes * 60 : 0;

  if (state.timerInterval) clearInterval(state.timerInterval);
  state.timerInterval = setInterval(() => {
    if (state.status !== 'playing') return;
    state.elapsedSeconds++;
    if (state.onTimerTick) state.onTimerTick(state.elapsedSeconds);
    if (state.timeLimitSeconds > 0 && state.elapsedSeconds >= state.timeLimitSeconds) {
      endGame('lost');
    }
  }, 1000);
}

export function selectCountry(countryId) {
  if (state.status !== 'playing') return;
  if (state.guessedCountries.has(countryId)) return;
  state.selectedCountryId = countryId;
}

export function submitGuess(userInput) {
  if (state.status !== 'playing') return null;
  if (state.selectedCountryId == null) return null;

  const countryId = state.selectedCountryId;
  const correct = checkAnswer(countryId, userInput);

  if (correct) {
    state.guessedCountries.add(countryId);
    state.correctCount++;
    const region = getRegion(countryId);
    if (state.onCorrectGuess) state.onCorrectGuess(countryId, region);
    state.selectedCountryId = null;

    if (state.correctCount >= state.totalCountries) {
      endGame('won');
    }
    return { correct: true, countryId, region };
  } else {
    state.lives--;
    if (state.onWrongGuess) state.onWrongGuess(countryId, state.lives);
    if (state.onLifeLost) state.onLifeLost(state.lives);

    if (state.lives <= 0 && state.maxLives !== Infinity) {
      endGame('lost');
    }
    return { correct: false, countryId, livesLeft: state.lives };
  }
}

export function giveUp() {
  if (state.status === 'playing') {
    endGame('lost');
  }
}

function endGame(result) {
  state.status = result;
  if (state.timerInterval) {
    clearInterval(state.timerInterval);
    state.timerInterval = null;
  }
  if (state.onGameEnd) state.onGameEnd(result);
}

export function setCallbacks(callbacks) {
  Object.assign(state, callbacks);
}
