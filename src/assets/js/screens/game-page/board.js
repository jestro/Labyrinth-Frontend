import * as Config from '../../data/config.js';
import * as EndScreen from '../end-screen.js';
import * as GameRenderer from './game-renderer.js';
import * as Requests from '../../api/api-requests.js';
import * as ScreenManager from '../../components/screen-manager.js';
import * as SidebarRenderer from './sidebar-renderer.js';
import * as Storage from '../../components/local-storage.js';

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


// -- Game Loop --

function updateLoop() {
    updateScreen();
    setTimeout(updateLoop, Config.GAME_POLLING_TIME_LONG);
}

function updateScreen() {
    updateSpareTile();
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
            Config.TURN_SOUND.play();
        }

        updateTurnVariables(currentShovePlayer, currentMovePlayer);
        updateCurrentObjective(game['players']);

        if (EndScreen.getWinningPlayerName(game['players']) != null) {
            ScreenManager.switchToPage('endscreen');
        }

        GameRenderer.renderBoard(game['maze'], playerNames);
        bindDynamicEvents();
        SidebarRenderer.renderSidebars(game['players'], playerNames, currentShovePlayer, currentMovePlayer);
    });
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
            updatePossiblePaths();
        });

    });
}

function activateArrow($button) {
    Config.CLICK_SOUND.play();
    $button.classList.add('pressed');

    setTimeout(() => {
        const $arrow = document.querySelector('.pressed');
        if($arrow != null){
            $arrow.classList.remove('pressed');
            updateScreen();
        }
    }, Config.GAME_POLLING_TIME_SHORT);
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


// -- Leave --

function leaveGame() {
    Requests.leaveGame(() => {
        ScreenManager.switchToPage('index');
    });
}


// -- SpareTile Rotation --

function rotateSpareTileClockwise() {
    Config.CLICK_SOUND.play();
    const walls = spareTile['walls'];
    const left = walls[walls.length - 1];
    for (let i = walls.length - 1; i > 0; i--) {
        walls[i] = walls[i - 1];
    }
    walls[0] = left;
    SidebarRenderer.renderSpareTile();
}

function rotateSpareTileCounterClockwise() {
    Config.CLICK_SOUND.play();
    const walls = spareTile['walls'];
    const top = walls[0];
    for (let i = 1; i < walls.length; i++) {
        walls[i - 1] = walls[i];
    }
    walls[walls.length - 1] = top;
    SidebarRenderer.renderSpareTile();
}


// -- Data Update --

function updatePossiblePaths() {
    Requests.getSingularPlayer(Storage.loadFromStorage('username'), (data) => {
        const {row, col} = data.location;
        Requests.getReachableLocations(Storage.loadFromStorage('gameId'), row, col, (locations) => {
            possiblePaths = locations['reachable'];
        });
    });
}

function updateSpareTile() {
    if (!isYourShove) {
        Requests.getSingularGame(Storage.loadFromStorage('gameId'), 'spareTile', (data) => {
            spareTile = data['spareTile'];
        });
    }
}

function updateTurnVariables(currentShovePlayer, currentMovePlayer) {
    isYourShove = currentShovePlayer === Storage.loadFromStorage('username');
    isYourMove = currentMovePlayer === Storage.loadFromStorage('username');
}

function updateCurrentObjective(playerData){
    const newObjective = playerData[Storage.loadFromStorage('username')]['objective'];
    if(currentObjective !== null && currentObjective !== newObjective){
        Config.TREASURE_COLLECT_SOUND.play();
    }
    currentObjective = newObjective;
}


// -- Data Set --

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


// -- Data Get --

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

function getBoardRows() {
    return boardRows;
}

export { init, getIsYourShove, getIsYourMove, getSpareTile, getCurrentObjective, isValidMove, getBoardRows };