import * as Requests from '../data-connector/api-requests.js';
import * as Sounds from '../components/sounds.js';
import * as Storage from '../data-connector/local-storage-abstractor.js';

function init(){
    const gameId = Storage.loadFromStorage('gameId');

    Requests.getSingularGame(gameId, 'players', (gameData) => {
        renderWinner(gameData['players']);
        displayLeaderboard(gameData['players']);

        if(getWinningPlayer(gameData['players']) === Storage.loadFromStorage('username')){
            Sounds.ACHIEVEMENT.play();
        }
    });
}

function getWinningPlayer(playersObj) {
    for (const player in playersObj) {
        if (playersObj[player]['state'] === 'WON') {
            return player;
        }
    }

    return null;
}

function isWinningPlayer(playersObj) {
    for (const player in playersObj) {
        if (playersObj[player]['state'] === 'WON') {
            return true;
        }
    }

    return false;
}

function renderWinner(playersObj) {
    const $winningHeader = document.querySelector('#end-screen h2');
    const winningPlayerObj = getWinningPlayer(playersObj);

    if (winningPlayerObj === null) {
        $winningHeader.innerHTML = `No winning player!`;
    } else {
        $winningHeader.innerHTML = `${winningPlayerObj} won the game!`;
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

export { init, isWinningPlayer };