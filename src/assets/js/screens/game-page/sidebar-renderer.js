import * as Board from './board.js';
import * as GameRenderer from './game-renderer.js';
import * as Sounds from '../../components/sounds.js';
import * as Storage from '../../data-connector/local-storage-abstractor.js';
import {renderSpareTile} from './game-renderer.js';

function displaySidebars(playerData, playerNames, currentShovePlayer, currentMovePlayer) {
    renderTurnList(playerData, playerNames, currentShovePlayer, currentMovePlayer);
    renderTurnState();
    renderCollectedTreasures(playerData);
    renderCurrentObjective();
}

function renderTurnList(playerData, playerNames, currentShovePlayer, currentMovePlayer) {
    const $container = document.querySelector('#turn-list');
    $container.innerHTML = '';

    for (const playerName of playerNames) {
        const $templateClone = document.querySelector('#player').content.firstElementChild.cloneNode(true);

        renderTurnListItem($templateClone, playerName, playerNames.indexOf(playerName), playerData, currentShovePlayer, currentMovePlayer);

        $container.insertAdjacentHTML('beforeend', $templateClone.outerHTML);
    }
}

function renderTurnListItem($templateClone, playerName, playerIndex, playerData, currentShovePlayer, currentMovePlayer) {
    $templateClone.setAttribute('class', `player${playerIndex}`);

    if (currentShovePlayer === playerName || currentMovePlayer === playerName) {
        $templateClone.classList.add('active');
    } else {
        $templateClone.classList.remove('active');
    }

    $templateClone.innerHTML = `${playerName} [${playerData[playerName]['treasuresFound'].length}]`;
}

function renderTurnState() {
    if (Board.getIsYourShove()) {
        document.querySelector('#turn-state').innerText = `It is your turn to shove a tile, ${Storage.loadFromStorage('username')}.`;
    } else if (Board.getIsYourMove()) {
        document.querySelector('#turn-state').innerText = `It is your turn to move your character, ${Storage.loadFromStorage('username')}.`;
    } else {
        document.querySelector('#turn-state').innerText = `It is not your turn, ${Storage.loadFromStorage('username')}.`;
    }
}

function renderCurrentObjective() {
    if (Board.getCurrentObjective() !== null) {
        document.querySelector('#game-bar #treasure-cards img').src = GameRenderer.getTreasureImagePath(Board.getCurrentObjective());
    }
}

function renderCollectedTreasures(playerData) {
    const $container = document.querySelector('#collected-treasures');
    const collectedTreasures = playerData[Storage.loadFromStorage('username')]['treasuresFound'];
    $container.innerHTML = '';

    collectedTreasures.forEach(treasure => {
        $container.insertAdjacentHTML('beforeend', renderCollectedTreasureImage(treasure));
    });
}

function renderCollectedTreasureImage(treasure) {
    const treasureImgName = treasure.replaceAll(' ', '-');
    return `<img src="assets/images/minecraft/nature/treasure/${treasureImgName}.png" alt="${treasure}">`;
}

function hideRotateButtons() {
    document.querySelector('#rotate-left').classList.add('hidden');
    document.querySelector('#rotate-right').classList.add('hidden');
}

export { displaySidebars, hideRotateButtons};