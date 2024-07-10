import * as Config from '../../data/config.js';
import * as Requests from '../../api/api-requests.js';
import * as ScreenManager from '../../components/screen-manager.js';
import * as Storage from '../../components/local-storage.js';
import * as Util from "../../components/util.js";

function init() {
    document.querySelector('#leave-lobby').addEventListener('click', leaveLobby);

    displayPlayerList();
}

function displayPlayerList() {
    if (Storage.loadFromStorage('gameId') !== null) {
        Requests.getSingularGame(Storage.loadFromStorage('gameId'), '', (result) => {
            const players = result['description']['players'];
            const maxCount = result['description']['maximumPlayers'];
            refreshPlayerList(players, maxCount);
            refreshPlayerCount(players, maxCount);
            refreshPlayerMessage(players, maxCount);
            setTimeout(displayPlayerList, Config.UI_POLLING_TIME_SHORT);
        });
    }
}

function refreshPlayerList(players, maxCount) {
    const $playerList = document.querySelector('#player-list');
    $playerList.innerHTML = '';

    for (const player of players) {
        $playerList.insertAdjacentElement('beforeend', Util.createParagraph(player));
    }

    for (let i = 0; i < maxCount - players.length; i++) {
        $playerList.insertAdjacentElement('beforeend', Util.createParagraph('Empty'));
    }
}

function refreshPlayerCount(players, maxCount) {
    document.querySelector('#player-count').innerText = `${players.length}/${maxCount}`;
}

function refreshPlayerMessage(players, maxCount) {
    if (players.length === maxCount){
        document.querySelector('#lobby-message').innerText = 'Redirecting...';
        ScreenManager.switchToPage('game');
    }
}

function leaveLobby() {
    Requests.leaveGame(() => {
        ScreenManager.switchToScreen('start-screen');
    });
}

export { init };