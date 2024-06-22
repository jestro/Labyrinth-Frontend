import * as Config from '../components/config.js';
import * as Requests from '../data-connector/api-requests.js';
import * as ScreenManager from '../components/screen-manager.js';
import * as Storage from '../data-connector/local-storage-abstractor.js';

function init() {
    document.querySelector('#leave-lobby').addEventListener('click', leaveLobby);

    fetchAndDisplayPlayerList();
}

function fetchAndDisplayPlayerList() {
    if (Storage.loadFromStorage('gameId') !== null) {
        Requests.getSingularGame(Storage.loadFromStorage('gameId'), '', (result) => {
            const players = result['description']['players'];
            const maxCount = result['description']['maximumPlayers'];
            refreshPlayerList(players, maxCount);
            refreshPlayerCount(players, maxCount);
            refreshPlayerMessage(players, maxCount);
            setTimeout(fetchAndDisplayPlayerList, Config.UI_POLLING_TIME_SHORT);
        });
    }
}

function refreshPlayerList(players, maxCount) {
    const $playerList = document.querySelector('#player-list');
    $playerList.innerHTML = '';

    for (const player of players) {
        $playerList.insertAdjacentElement('beforeend', renderListDiv(player));
    }

    for (let i = 0; i < maxCount - players.length; i++) {
        $playerList.insertAdjacentElement('beforeend', renderListDiv('Empty'));
    }
}

function renderListDiv(item) {
    const $div = document.createElement('div');
    $div.innerText = item;
    return $div;
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