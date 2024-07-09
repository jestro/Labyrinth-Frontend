import * as Communication from './api-communication.js';
import * as Config from '../data/config.js';
import * as Handler from '../components/error-handler.js';
import * as Storage from '../components/local-storage.js';

// Run = function parameter
// Check out the loading of the games in games-list.js to have a reference of how it works

// -- GET --

function connectionTestApiInfo() {
    Communication.fetchFromServer('info', 'GET').catch(Handler.handleAPIError);
}

function getTreasureList(run) {
    Communication.fetchFromServer('treasures', 'GET')
        .then(data => {
            // data = an array of treasure names
            run(data);
        });
}

function getGamesList(showOnlyAccepting, run) {
    Communication.fetchFromServer(`games?prefix=${Config.GAME_PREFIX}&onlyAccepting=${showOnlyAccepting}`, 'GET')
        .then(data => {
            // data = an array of objects holding the games' info and state
            // (players, id, gamemode, current shove/move, ...)
            run(data);
        }).catch(Handler.handleAPIError);
}

function getSingularGame(gameId, info, run) {
    Communication.fetchFromServer(`games/${gameId}${infoRequestString(info)}`, 'GET')
        .then(data => {
            // data = object with info about whatever you ask for
            // maze, players, initialMaze, history and spareTile (options)
            run(data);
        }).catch(Handler.handleAPIError);
}

function infoRequestString(info) {
    switch (info) {
        case 'maze':
            return '?description=false&maze=true';
        case 'players':
            return '?description=false&players=true';
        case 'initialMaze':
            return '?description=false&initialMaze=true';
        case 'history':
            return '?description=false&history=true';
        case 'spareTile':
            return '?description=false&spareTile=true';
        default:
            return '';
    }
}

function getGameData(run) {
    Communication.fetchFromServer(`games/${Storage.loadFromStorage('gameId')}?description=true&players=true&maze=true`)
        .then(gameData => {
            run(gameData);
        }).catch(Handler.handleAPIError);
}

function getSingularPlayer(playerName, run) {
    Communication.fetchFromServer(`games/${Storage.loadFromStorage('gameId')}/players/${playerName}`, 'GET')
        .then(data => {
            // data = object with player state
            // (name, location, objective, state, ...)
            run(data);
        }).catch(Handler.handleAPIError);
}

function getReachableLocations(gameId, row, col, run) {
    Communication.fetchFromServer(`games/${gameId}/maze/locations/${row}/${col}`, 'GET')
        .then(data => {
            // data = array of objects containing rows & cols (reachable)
            run(data);
        }).catch(Handler.handleAPIError);
}


// -- POST --

function createGame(name, playerName, gameMode, treasureCount, playerCount, mazeRows, run) {
    Communication.fetchFromServer('games', 'POST', {
        'prefix': Config.GAME_PREFIX,
        'gameName': name,
        'playerName': playerName,
        'gameMode': gameMode,
        'minimumPlayers': playerCount,
        'maximumPlayers': playerCount,
        'numberOfTreasuresPerPlayer': treasureCount,
        'mazeRows': mazeRows
    })
        .then(data => {
            // data = object with gameId, playerName and playerToken.
            run(data);
        }).catch(Handler.handleAPIError);
}

function joinGame(gameId, run) {
    Communication.fetchFromServer(`games/${gameId}/players/${Storage.loadFromStorage('username')}`, 'POST')
        .then(data => {
            run(data);
        }).catch(Handler.handleAPIError);
}


// -- DELETE --

function leaveGame(run) {
    Communication.fetchFromServer(`games/${Storage.loadFromStorage('gameId')}/players/${Storage.loadFromStorage('username')}`, 'DELETE')
        .then(data => {
            run(data);
        }).catch(Handler.handleAPIError);
}


// -- PATCH --

function shoveRequest(row, col, gameWalls, gameTreasure, run) {
    Communication.fetchFromServer(`games/${Storage.loadFromStorage('gameId')}/maze`, 'PATCH', {
        'destination': {'row': row, 'col': col},
        'tile': {'walls': gameWalls, 'treasure': gameTreasure, 'players': ['string']}
    }).then(data => {
        run(data);
    }).catch(Handler.handleAPIError);
}

function moveRequest(row, col, run) {
    Communication.fetchFromServer(`games/${Storage.loadFromStorage('gameId')}/players/${Storage.loadFromStorage('username')}/location`, 'PATCH', {
        'destination': {'row': row, 'col': col}
    }).then(data => {
        run(data);
    }).catch(Handler.handleAPIError);
}


export {
    connectionTestApiInfo,
    getTreasureList,
    getGamesList,
    getSingularGame,
    getGameData,
    getSingularPlayer,
    getReachableLocations,
    createGame,
    joinGame,
    leaveGame,
    shoveRequest,
    moveRequest
};