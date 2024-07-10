import * as Config from '../../data/config.js';
import * as Requests from '../../api/api-requests.js';
import * as ScreenManager from '../../components/screen-manager.js';
import * as Storage from '../../components/local-storage.js';

function init() {
    document.querySelector('#join-game').addEventListener('click', joinGame);
    document.querySelector('#show-all-games').addEventListener('change', displayGamesList);
    displayGamesList();
}

function displayGamesList() {
    const showAllGames = document.querySelector('#show-all-games').checked;
    Requests.getGamesList(!showAllGames, (games) => {
        showGames(games);
        setTimeout(displayGamesList, Config.UI_POLLING_TIME_SHORT);
    });
}

function joinGame() {
    const $gameRadio = getSelectedGame();
    if ($gameRadio !== null && isGameIdValid($gameRadio.id)) {
        Requests.joinGame($gameRadio.id, (result) => {
            Storage.saveToStorage('gameId', result['gameId']);
            Storage.saveToStorage('playerToken', result['playerToken']);
            ScreenManager.switchToScreen('game-lobby');
        });
    } else {
        document.querySelector(Config.ERRORHANDLER_SELECTOR).innerText = 'No game selected';
    }
}

function getSelectedGame() {
    return document.querySelector('#games-list input[type=radio]:checked');
}

function isGameIdValid(gameId) {
    return gameId !== null && gameId !== undefined;
}

function showGames(games) {
    const $container = document.querySelector('#game-list');
    const selectedGame = getSelectedGame();
    $container.innerHTML = '';
    for (const game of games['games']) {
        const $template = document.querySelector('#games-list template');
        const $templateClone = $template.content.firstElementChild.cloneNode(true);
        renderGame($templateClone, game);

        if (isGameFull(game)) {
            const $radioInput = $templateClone.querySelector('input[type="radio"]');
            $radioInput.disabled = true;
        }

        $container.insertAdjacentHTML('beforeend', $templateClone.outerHTML);
    }

    selectRememberedGame(selectedGame);
}

function isGameFull(game) {
    return game['players'].length === game['maximumPlayers'];
}

function renderGame($template, game) {
    $template.querySelector('span.player-count').innerText = `${game.players.length}/${game['maximumPlayers']}`;
    $template.querySelector('span.game-mode').innerText = game['gameMode'];

    $template.querySelector('label').setAttribute('for', game['gameId']);
    $template.querySelector('label').innerText = game.gameName;

    $template.querySelector('input').id = game['gameId'];
}

function selectRememberedGame(selectedGame) {
    if (selectedGame !== null) {
        const $selectedGameRadio = document.querySelector(`input[type="radio"][id="${selectedGame.id}"]`);
        if ($selectedGameRadio !== null) {
            $selectedGameRadio.checked = true;
        }
    }
}

export {init};