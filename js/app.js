// js/app.js — Bootstrap, wires modules together (mediator pattern)

import * as map from './map.js';
import * as game from './game.js';
import * as ui from './ui.js';
import * as autocomplete from './autocomplete.js';
import { getAllCountryIds } from './data.js';

document.addEventListener('DOMContentLoaded', () => {
  ui.cacheDom();
  ui.showStartModal(startGame);
});

async function startGame(config) {
  // Init game state
  game.init(config);
  const state = game.getState();

  // Set up UI
  ui.initSidebar();
  ui.updateScore(0, state.totalCountries);
  ui.updateLives(state.lives, state.maxLives);
  ui.updateTimer(0, state.timeLimitSeconds);
  ui.showSelectedCountry(null);

  // Set up game callbacks
  game.setCallbacks({
    onTimerTick: (elapsed) => {
      ui.updateTimer(elapsed, state.timeLimitSeconds);
    },
    onCorrectGuess: (countryId, region) => {
      map.markGuessed(countryId);
      ui.showFeedback(true, countryId);
      ui.updateScore(state.correctCount, state.totalCountries);
      ui.updateRegionProgress(state.guessedCountries);
      autocomplete.updateGuessed(state.guessedCountries);
      autocomplete.clear();
      ui.showSelectedCountry(null);
    },
    onWrongGuess: (countryId, livesLeft) => {
      ui.showFeedback(false, countryId);
      ui.updateLives(livesLeft, state.maxLives);
      autocomplete.clear();
      ui.focusInput();
    },
    onLifeLost: (livesLeft) => {
      // Pulse animation on hearts handled by CSS
    },
    onGameEnd: (result) => {
      ui.enableInput(false);
      map.deselectAll();
      autocomplete.hide();
      ui.showEndModal(result, {
        correct: state.correctCount,
        total: state.totalCountries,
        elapsedSeconds: state.elapsedSeconds,
        guessedCountries: state.guessedCountries
      });
    }
  });

  // Load and render map
  await map.loadAndRender('#map-container', (countryId) => {
    // Map click handler
    if (state.status !== 'playing') return;
    if (state.guessedCountries.has(countryId)) return;
    game.selectCountry(countryId);
    map.selectCountry(countryId);
    ui.showSelectedCountry(countryId);
    autocomplete.clear();
  });

  // Set up input and autocomplete
  const guessInput = document.getElementById('guess-input');
  const acDropdown = document.getElementById('ac-dropdown');

  autocomplete.init(guessInput, acDropdown, (selectedName) => {
    // Auto-submit on autocomplete selection
    handleSubmit();
  });

  // Submit button
  document.getElementById('submit-btn').onclick = handleSubmit;

  // Enter key submits what's in the input (unless autocomplete already handled it)
  guessInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.defaultPrevented) {
      e.preventDefault();
      autocomplete.hide();
      handleSubmit();
    }
  });

  // Zoom controls
  document.getElementById('zoom-in').onclick = map.zoomIn;
  document.getElementById('zoom-out').onclick = map.zoomOut;
  document.getElementById('zoom-reset').onclick = map.zoomReset;

  // Give up button
  document.getElementById('give-up-btn').onclick = () => {
    if (confirm('Are you sure you want to give up?')) {
      game.giveUp();
    }
  };

  // Play again button
  document.getElementById('play-again-btn').onclick = () => {
    ui.hideEndModal();
    // Clear the map container and restart
    document.getElementById('map-container').innerHTML = '';
    ui.showStartModal(startGame);
  };
}

function handleSubmit() {
  const val = ui.getInputValue().trim();
  if (!val) return;
  const result = game.submitGuess(val);
  // result is handled by callbacks
}
