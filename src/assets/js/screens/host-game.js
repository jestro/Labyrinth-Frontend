import * as Requests from '../data-connector/api-requests.js';
import * as ScreenManager from '../components/screen-manager.js';
import * as Storage from '../data-connector/local-storage-abstractor.js';
import * as Util from '../components/util.js';
import * as Config from '../components/config.js';

function init() {
    document.querySelector('#game-host').addEventListener('click', hostGame);

    const $sizeOptions = document.querySelector('#board-size');
    renderOptions($sizeOptions, Config.ALLOWED_MAZE_SIZES, Config.DEFAULT_MAZE_SIZE);

    const $gameModeOptions = document.querySelector('#game-mode');
    renderOptions($gameModeOptions, Config.GAME_MODES, Config.DEFAULT_GAME_MODE);
}

function renderOptions($container, options, defaultValue) {
    $container.innerHTML = '';

    for (const setting in options) {
        const value = options[setting];
        const $option = Util.createOptionElement(setting, value);
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
    if (isPlayerCountValid(playerCount) && isTreasureCountValid(treasureCount) && Util.isInputValid(gameName)) {
        Requests.createGame(gameName, Storage.loadFromStorage('username'), gameMode, treasureCount, playerCount, mazeSize, (result) => {
            // Executes when game is created successfully
            Storage.saveToStorage('gameId', result['gameId']);
            Storage.saveToStorage('playerToken', result['playerToken']);
            ScreenManager.switchToScreen('game-lobby');
        });
    } else {
        Util.renderErrorMessage(gameErrorMessage(playerCount, treasureCount, gameName));
    }
}

function isTreasureCountValid(treasureCount) {
    return Util.isCountValid(treasureCount, Config.MIN_TREASURES, Config.MAX_TREASURES);
}

function isPlayerCountValid(playerCount) {
    return Util.isCountValid(playerCount, Config.MIN_PLAYERS, Config.MAX_PLAYERS);
}

function gameErrorMessage(playerCount, treasureCount, gameName) {
    if (Util.inputErrorMessage(gameName) === null) {
        if (!isPlayerCountValid(playerCount)) {
            return `Invalid player count. (${Config.MIN_PLAYERS}-${Config.MAX_PLAYERS})`;
        } else if (!isTreasureCountValid(treasureCount)) {
            return `Invalid treasure goal. (${Config.MIN_TREASURES}-${Config.MAX_TREASURES})`;
        } else {
            return null;
        }
    } else {
        return Util.inputErrorMessage(gameName);
    }
}

export {init};