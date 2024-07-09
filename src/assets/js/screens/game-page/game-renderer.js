import * as Board from './board.js';
import * as Config from '../../data/config.js';
import * as Util from '../../components/util.js';

// -- Maze Rendering --

function displayMaze(maze, playerNames) {
    const $container = document.querySelector('#maze');
    $container.innerHTML = '';

    appendArrowsTopBottom($container, 'top');
    renderMaze($container, maze, playerNames);
    appendArrowsTopBottom($container, 'bottom');

    if (maze['oppositePosition'] != null) {
        const oppositeRow = maze['oppositePosition']['row'];
        const oppositeCol = maze['oppositePosition']['col'];

        const $arrow = document.querySelector(`button[data-col="${oppositeCol}"][data-row="${oppositeRow}"]`);
        if ($arrow !== null) {
            $arrow.disabled = true;
        }
    }
}

function setMazeDisplaySize(size){
    const $maze = document.querySelector('#maze');
    $maze.setAttribute('data-height', size);
}

function renderMaze($container, maze, playerNames) {
    for (let x = 0; x < maze['board'].length; x++) {
        const $template = document.querySelector('main template').content.firstElementChild.cloneNode(true);

        $template.setAttribute('id', `row${x}`);

        if (Util.isOdd(x)) {
            appendArrowsSides($template, x);
        }

        for (let y = 0; y < maze['board'][x].length; y++) {
            const tile = maze['board'][x][y];
            const gridSelector = `.grid-item[data-col="${y}"]`;

            $template.querySelector(gridSelector).append(renderTile(tile, playerNames));
            $template.querySelector(gridSelector).setAttribute('data-row', x);
            $template.querySelector(gridSelector).setAttribute('data-col', y);
            if (!Board.isValidMove(x, y)){
                $template.querySelector(gridSelector).classList.add('unreachable');
            }
        }

        $container.insertAdjacentHTML('beforeend', $template.outerHTML);
    }
}


// -- Tile Rendering --

function renderTile(tile, playerNames) {
    const $imageDiv = document.createElement('div');

    addTileImage($imageDiv, tile['walls']);
    addTreasureImage($imageDiv, tile['treasure']);
    addPlayerImage($imageDiv, tile['players'], playerNames);

    return $imageDiv;
}

function addTileImage($imageDiv, wallsOnTile) {
    const $tileImage = document.createElement('img');
    $tileImage.src = tileImgPath(wallsOnTile);
    $tileImage.alt = tileImgName(wallsOnTile);
    $tileImage.classList.add('tile-image');
    $imageDiv.append($tileImage);
}

function tileImgPath(wallsBlocked) {
    return `${Config.getImageAssetsPath()}/tiles/${tileImgName(wallsBlocked)}.png`;
}

function tileImgName(wallsBlocked) {
    let name = "";

    for (const isWallBlocked of wallsBlocked) {
        if (isWallBlocked) {
            name += '1';
        } else {
            name += '0';
        }
    }

    return name;
}

function addTreasureImage($imageDiv, treasureOnTile) {
    let $treasureImage;
    if (treasureOnTile !== null) {
        const treasurePath = getTreasureImagePath(treasureOnTile);
        $treasureImage = document.createElement('img');
        $treasureImage.src = treasurePath;
        $treasureImage.alt = treasureOnTile;
        $treasureImage.classList.add('treasure-image');
        $imageDiv.append($treasureImage);
    }
}

function getTreasureImagePath(treasure) {
    return `${Config.getImageAssetsPath()}/treasure/${treasure.replaceAll(' ', '-')}.png`;
}

function addPlayerImage($imageDiv, playersOnTile, playerNames) {
    let $playerImage;
    if (playersOnTile !== undefined && playersOnTile.length > 0) {
        const playerPath = getPlayerImagePath(playerNames, playersOnTile);
        $playerImage = document.createElement('img');
        $playerImage.src = playerPath;
        $playerImage.alt = playersOnTile[0];
        $playerImage.classList.add('player-image');
        $imageDiv.append($playerImage);
    }
}

function getPlayerImagePath(playerNames, playersOnTile) {
    return `${Config.getImageAssetsPath()}/players/${playerNames.indexOf(playersOnTile[0])}.png`
}

// -- Arrow Rendering --

function appendArrowsTopBottom($container, side) {
    const $template = document.querySelector('main template').content.firstElementChild.cloneNode(true);
    for (let col = 0; col < Config.MAZE_ROWS; col++) {
        if(Util.isOdd(col)){
            $template.querySelector(`.grid-item[data-col="${col}"]`).append(createArrow(side, null, col));
        }
    }
    $container.insertAdjacentHTML('beforeend', $template.outerHTML);
}

function appendArrowsSides($template, row) {
    const rowSelector = `#row${row}`;

    $template.querySelector(`${rowSelector} .left-arrow`).append(createArrow('left', row, 0));
    $template.querySelector(`${rowSelector} .right-arrow`).append(createArrow('right', row, Config.MAZE_ROWS - 1));
}

function createArrow(side, row, col) {
    switch (side) {
        case 'left':
            col = 0;
            break;
        case 'right':
            col = Config.MAZE_ROWS - 1;
            break;
        case 'top':
            row = 0;
            break;
        case 'bottom':
            row = Board.getBoardRows() - 1;
            break;
        default:
            break;
    }
    return styleArrow(side, row, col);
}

function styleArrow(side, row, col) {
    const $arrow = document.createElement('button');
    $arrow.setAttribute('data-row', row);
    $arrow.setAttribute('data-col', col);

    $arrow.classList.add(`theme-${Config.UI_THEME}`);
    $arrow.classList.add(`arrow-${side}`);
    $arrow.classList.add('arrow');

    if (!Board.getIsYourShove()) {
        $arrow.disabled = true;
    }
    return $arrow;
}

export { displayMaze, renderTile, getTreasureImagePath, setMazeDisplaySize };