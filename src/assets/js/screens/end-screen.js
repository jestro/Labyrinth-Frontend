import * as Requests from '../api/api-requests.js';
import * as Storage from '../components/local-storage.js';
import * as Config from "../data/config.js";

function init(){
    const gameId = Storage.loadFromStorage('gameId');

    Requests.getSingularGame(gameId, 'players', (gameData) => {
        renderWinner(gameData['players']);
        displayLeaderboard(gameData['players']);

        if(getWinningPlayerName(gameData['players']) === Storage.loadFromStorage('username')){
            Config.TREASURE_COLLECT_SOUND.play();
        }
    });
}

function getWinningPlayerName(playersObj) {
    for (const playerName in playersObj) {
        if (playersObj[playerName]['state'] === 'WON') {
            return playerName;
        }
    }

    return null;
}

function renderWinner(playersObj) {
    const $winningHeader = document.querySelector('#end-screen h2');
    const winningPlayerName = getWinningPlayerName(playersObj);

    if (winningPlayerName === null) {
        $winningHeader.innerHTML = `No winning player!`;
    } else {
        $winningHeader.innerHTML = `${winningPlayerName} won the game!`;
    }
}

function comparePlayers(a, b) {
    return b['treasuresFound'].length - a['treasuresFound'].length;
}

function renderLeaderboardItem($template, player, rank) {
    $template.querySelector('.player-rank').innerText = parseInt(rank) + 1;
    $template.querySelector('.player-name').innerText = player['name'];

    if (player['treasuresFound'] === undefined) {
        $template.querySelector('.player-treasures').innerText = 0;
    } else {
        $template.querySelector('.player-treasures').innerText = player['treasuresFound'].length + ' treasures';
    }
}

function makePlayerList(playersObj) {
    const players = [];

    for (const playerObj in playersObj) {
        players.push(playersObj[playerObj]);
    }

    players.sort(comparePlayers);
    return players;
}

function displayLeaderboard(playersObj) {
    const $leaderboard = document.querySelector('#leaderboard');
    const players = makePlayerList(playersObj);

    for (const player of players) {
        const $template = document.querySelector('template');
        const $templateClone = $template.content.firstElementChild.cloneNode(true);

        renderLeaderboardItem($templateClone, player, players.indexOf(player));
        $leaderboard.insertAdjacentHTML('beforeend', $templateClone.outerHTML);
    }
}

export { init, getWinningPlayerName };