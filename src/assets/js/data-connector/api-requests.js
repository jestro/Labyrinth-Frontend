import * as CommunicationAbstractor from './api-communication-abstractor.js';
import * as Config from '../components/config.js';
import * as ErrorHandler from './error-handler.js';
import * as Storage from './local-storage-abstractor.js';

// Run = function parameter
// Check out the loading of the games in games-list.js to have a reference of how it works

// -- GET --

function connectionTestApiInfo() {
    CommunicationAbstractor.fetchFromServer('info', 'GET').catch(ErrorHandler.handleError);
}

function getTreasureList(run) {
    CommunicationAbstractor.fetchFromServer('treasures', 'GET')
        .then(data => {
            // data = an array of treasure names
            run(data);
        });
}

function getGamesList(showOnlyAccepting, run) {
    CommunicationAbstractor.fetchFromServer(`games?prefix=${Config.GAME_PREFIX}&onlyAccepting=${showOnlyAccepting}`, 'GET')
        .then(data => {
            // data = an array of objects holding the games' info and state
            // (players, id, gamemode, current shove/move, ...)
            run(data);
        }).catch(ErrorHandler.handleError);
}

function getSingularGame(gameId, info, run) {
    CommunicationAbstractor.fetchFromServer(`games/${gameId}${infoRequestString(info)}`, 'GET')
        .then(data => {
            // data = object with info about whatever you ask for
            // maze, players, initialMaze, history and spareTile (options)
            run(data);
        }).catch(ErrorHandler.handleError);
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
    CommunicationAbstractor.fetchFromServer(`games/${Storage.loadFromStorage('gameId')}?description=true&players=true&maze=true`)
        .then(gameData => {
            run(gameData);
        }).catch(ErrorHandler.handleError);
}

function getSingularPlayer(playerName, run) {
    CommunicationAbstractor.fetchFromServer(`games/${Storage.loadFromStorage('gameId')}/players/${playerName}`, 'GET')
        .then(data => {
            // data = object with player state
            // (name, location, objective, state, ...)
            run(data);
        }).catch(ErrorHandler.handleError);
}

function getReachableLocations(gameId, row, col, run) {
    CommunicationAbstractor.fetchFromServer(`games/${gameId}/maze/locations/${row}/${col}`, 'GET')
        .then(data => {
            // data = array of objects containing rows & cols (reachable)
            run(data);
        }).catch(ErrorHandler.handleError);
}


// -- POST --

function createGame(name, playerName, gameMode, treasureCount, playerCount, mazeRows, run) {
    CommunicationAbstractor.fetchFromServer('games', 'POST', {
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
        }).catch(ErrorHandler.handleError);
}

function joinGame(gameId, run) {
    CommunicationAbstractor.fetchFromServer(`games/${gameId}/players/${Storage.loadFromStorage('username')}`, 'POST')
        .then(data => {
            run(data);
        }).catch(ErrorHandler.handleError);
}


// -- DELETE --

function leaveGame(run) {
    CommunicationAbstractor.fetchFromServer(`games/${Storage.loadFromStorage('gameId')}/players/${Storage.loadFromStorage('username')}`, 'DELETE')
        .then(data => {
            run(data);
        }).catch(ErrorHandler.handleError);
}


// -- PATCH --

function shoveRequest(row, col, gameWalls, gameTreasure, run) {
    CommunicationAbstractor.fetchFromServer(`games/${Storage.loadFromStorage('gameId')}/maze`, 'PATCH', {
        'destination': {'row': row, 'col': col},
        'tile': {'walls': gameWalls, 'treasure': gameTreasure, 'players': ['string']}
    }).then(data => {
        run(data);
    }).catch(ErrorHandler.handleError);
}

function moveRequest(row, col, run) {
    CommunicationAbstractor.fetchFromServer(`games/${Storage.loadFromStorage('gameId')}/players/${Storage.loadFromStorage('username')}/location`, 'PATCH', {
        'destination': {'row': row, 'col': col}
    }).then(data => {
        run(data);
    }).catch(ErrorHandler.handleError);
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