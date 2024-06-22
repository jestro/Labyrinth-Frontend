import * as Config from '../../components/config.js';
import * as EndScreen from '../end-screen.js';
import * as GameRenderer from './game-renderer.js';
import * as Requests from '../../data-connector/api-requests.js';
import * as ScreenManager from '../../components/screen-manager.js';
import * as SidebarRenderer from './sidebar-renderer.js';
import * as Sounds from '../../components/sounds.js';
import * as Storage from '../../data-connector/local-storage-abstractor.js';

let currentObjective = null;
let isYourShove = false;
let isYourMove = false;
let spareTile;
let possiblePaths;
let boardRows;
let gameMode;

function init() {
    bindStaticEvents();
    updateLoop();
}

// -- Event Binders --

function bindStaticEvents() {
    document.querySelector('#leave-game').addEventListener('click', leaveGame);
    document.querySelector('#rotate-right').addEventListener('click', rotateSpareTileCounterClockwise);
    document.querySelector('#rotate-left').addEventListener('click', rotateSpareTileClockwise);
}

function bindDynamicEvents() {
    const $container = document.querySelector('#maze');

    const $buttons = $container.querySelectorAll('button');
    for (const element of $buttons) {
        element.addEventListener('click', shove);
    }

    const $span = $container.querySelectorAll('.grid-item');
    for (let i = Config.MAZE_ROWS; i < $span.length - Config.MAZE_ROWS; i++) {
        $span[i].addEventListener('click', move);
    }
}


// -- Display --

function updateLoop() {
    updateScreen();
    setTimeout(updateLoop, Config.GAME_POLLING_TIME_LONG);
}

function updateScreen() {
    fetchSpareTile();
    displayGame();
}

function displayGame() {
    Requests.getGameData(game => {
        const playerNames = game['description']['players'];
        const currentMovePlayer = game['description']['currentMovePlayer'];
        const currentShovePlayer = game['description']['currentShovePlayer'];

        setBoardRows(parseInt(game['maze']['rows']));
        setGameMode(game['description']['gameMode']);

        if (isYourShove === false && currentShovePlayer === Storage.loadFromStorage('username')) {
            Sounds.LEVEL_UP.play();
        }

        updateTurnVariables(currentShovePlayer, currentMovePlayer);
        updateCurrentObjective(game['players']);

        if (EndScreen.isWinningPlayer(game['players'])) {
            ScreenManager.switchToPage('endscreen');
        }

        GameRenderer.displayMaze(game['maze'], playerNames);
        bindDynamicEvents();
        SidebarRenderer.displaySidebars(game['players'], playerNames, currentShovePlayer, currentMovePlayer);
    });
}

function updateTurnVariables(currentShovePlayer, currentMovePlayer) {
    isYourShove = currentShovePlayer === Storage.loadFromStorage('username');
    isYourMove = currentMovePlayer === Storage.loadFromStorage('username');
}

function updateCurrentObjective(playerData){
    const newObjective = playerData[Storage.loadFromStorage('username')]['objective'];
    if(currentObjective !== null && currentObjective !== newObjective){
        Sounds.ACHIEVEMENT.play();
    }
    currentObjective = newObjective;
}

function setBoardRows(height){
    if (boardRows == null || isNaN(boardRows)){
        boardRows = height;
        GameRenderer.setMazeDisplaySize(height);
    }
}

function setGameMode(mode) {
    if (gameMode == null) {
        gameMode = mode;
        if(gameMode === 'hardcore'){
            SidebarRenderer.hideRotateButtons();
        }
    }
}

// -- Shove --

function shove(e) {
    activateArrow(e.target);
    Requests.getSingularGame(Storage.loadFromStorage('gameId'), 'spareTile', () => {
        const row = parseInt(e.target.dataset['row']);
        const col = parseInt(e.target.dataset['col']);
        const gameWalls = spareTile['walls'];
        const gameTreasure = spareTile['treasure'];

        Requests.shoveRequest(row, col, gameWalls, gameTreasure, () => {
            showReachableLocations();
        });

    });
}

function activateArrow($button) {
    Sounds.CLICK.play();
    $button.classList.add('pressed');

    setTimeout(() => {
        const $arrow = document.querySelector('.pressed');
        if($arrow != null){
            $arrow.classList.remove('pressed');
            updateScreen();
        }
    }, Config.GAME_POLLING_TIME_SHORT);
}


function showReachableLocations() {
    Requests.getSingularPlayer(Storage.loadFromStorage('username'), (data) => {
        const {row, col} = data.location;
        Requests.getReachableLocations(Storage.loadFromStorage('gameId'), row, col, (locations) => {
            possiblePaths = locations['reachable'];
        });
    });
}

function hideReachableLocations() {
    possiblePaths = null;
    document.querySelectorAll('.grid-item.unreachable').forEach(($tile) => {
        $tile.classList.remove('unreachable');
    });

}

function isValidMove(row, col) {
    if (!possiblePaths || possiblePaths.length === 0) {
        return true;
    }

    for (const location of possiblePaths) {
        if (location.row === row && location.col === col) {
            return true;
        }
    }

    return false;
}


// -- Move --

function move(e) {
    const row = parseInt(e.target.parentElement.parentElement.dataset['row']);
    const col = parseInt(e.target.parentElement.parentElement.dataset['col']);

    Requests.moveRequest(row, col, (data) => {
        if (data['message'] === undefined) {
            hideReachableLocations();
        }
    });
    setTimeout(updateScreen, Config.GAME_POLLING_TIME_SHORT);


}

// -- Leave --

function leaveGame() {
    Requests.leaveGame(() => {
        ScreenManager.switchToPage('index');
    });
}

// -- SpareTile --

function fetchSpareTile() {
    if (!isYourShove) {
        Requests.getSingularGame(Storage.loadFromStorage('gameId'), 'spareTile', (data) => {
            spareTile = data['spareTile'];

            GameRenderer.renderSpareTile();
        });
    }
}

function rotateSpareTileClockwise() {
    Sounds.CLICK.play();
    const walls = spareTile['walls'];
    const left = walls[walls.length - 1];
    for (let i = walls.length - 1; i > 0; i--) {
        walls[i] = walls[i - 1];
    }
    walls[0] = left;
    GameRenderer.renderSpareTile();
}

function rotateSpareTileCounterClockwise() {
    Sounds.CLICK.play();
    const walls = spareTile['walls'];
    const top = walls[0];
    for (let i = 1; i < walls.length; i++) {
        walls[i - 1] = walls[i];
    }
    walls[walls.length - 1] = top;
    GameRenderer.renderSpareTile();
}


// -- Global variable getters --

function getIsYourMove() {
    return isYourMove;
}

function getIsYourShove() {
    return isYourShove;
}

function getCurrentObjective() {
    return currentObjective;
}

function getSpareTile() {
    return spareTile;
}

function getPossibleLocations() {
    return possiblePaths;
}

function getBoardRows() {
    return boardRows;
}

export {
    init,
    getIsYourShove,
    getIsYourMove,
    getSpareTile,
    getCurrentObjective,
    isValidMove,
    getPossibleLocations,
    getBoardRows
};