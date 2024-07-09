import * as Requests from '../api/api-requests.js';
import * as ScreenManager from '../components/screen-manager.js';
import * as Storage from '../components/local-storage.js';
import * as Util from '../components/util.js';
import * as Config from '../data/config.js';
import * as Handler from '../components/error-handler.js';

function init() {
    document.querySelector('#game-host').addEventListener('click', hostGame);

    const $sizeOptions = document.querySelector('#board-size');
    renderOptions($sizeOptions, Config.ALLOWED_MAZE_SIZES, Config.DEFAULT_MAZE_SIZE);

    const $gameModeOptions = document.querySelector('#game-mode');
    renderOptions($gameModeOptions, Config.GAME_MODES, Config.DEFAULT_GAME_MODE);
}

function renderOptions($container, options, defaultValue) {
    $container.innerHTML = '';

    for (const option in options) {
        const value = options[option];
        const $option = Util.createOptionElement(option, value);
        if (value === defaultValue) $option.selected = true;
        $container.insertAdjacentElement('beforeend', $option);
    }
}

function hostGame(e) {
    e.preventDefault();

    const gameName = document.querySelector('#game-name').value;
    const playerCount = parseInt(document.querySelector('#players').value);
    const treasureCount = parseInt(document.querySelector('#treasures').value);
    const $boardSize = document.querySelector('#board-size');
    const mazeSize = parseInt($boardSize.options[$boardSize.selectedIndex].value);
    const $gameMode = document.querySelector('#game-mode');
    const gameMode = $gameMode.options[$gameMode.selectedIndex].value;

    if (!Handler.renderGameOptionsError(playerCount, treasureCount) && !Handler.renderInvalidNameError(gameName)) {
        Requests.createGame(gameName, Storage.loadFromStorage('username'), gameMode, treasureCount, playerCount, mazeSize, (result) => {
            // Executes when game is created successfully
            Storage.saveToStorage('gameId', result['gameId']);
            Storage.saveToStorage('playerToken', result['playerToken']);
            ScreenManager.switchToScreen('game-lobby');
        });
    } else {
        Handler.renderGameOptionsError(playerCount, treasureCount);
        Handler.renderInvalidNameError(gameName);
    }
}

export {init};