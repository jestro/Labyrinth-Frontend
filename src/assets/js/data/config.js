const UI_POLLING_TIME_LONG = 5000;
const UI_POLLING_TIME_SHORT = 1000;
const GAME_POLLING_TIME_LONG = 2000;
const GAME_POLLING_TIME_SHORT = 500;

const MAZE_ROWS = 7;
const ALLOWED_MAZE_SIZES = {'Small': 5, 'Classic': 7, 'Large': 9};
const DEFAULT_MAZE_SIZE = 7;
const GAME_MODES = {'Simple': 'simple', 'Teleportation': 'teleport', 'Hardcore': 'hardcore'};
const DEFAULT_GAME_MODE = 'simple';
const ALLOWED_CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789 ';
const CHAR_LIMIT = 20;

const MAX_TREASURES = 10;
const MIN_TREASURES = 1;
const MAX_PLAYERS = 8;
const MIN_PLAYERS = 2;

const GAME_THEME = 'minecraft/nature';
const UI_THEME = 'nature';
const GAME_PREFIX = 'group13';

const CLICK_SOUND = new Audio(`assets/audio/${GAME_THEME}/click.mp3`);
const TURN_SOUND = new Audio(`assets/audio/${GAME_THEME}/level-up.mp3`);
const TREASURE_COLLECT_SOUND = new Audio(`assets/audio/${GAME_THEME}/achievement.mp3`);

const ERRORHANDLER_SELECTOR = '.screen:not(.hidden) .errormessage';

const SERVER_URL = `http://localhost:8000/`;

function getAPIUrl() {
    return SERVER_URL;
}

function getImageAssetsPath() {
    return `assets/images/${GAME_THEME}`;
}

export {
    getAPIUrl,
    getImageAssetsPath,
    GAME_PREFIX,
    ERRORHANDLER_SELECTOR,
    UI_POLLING_TIME_LONG,
    UI_POLLING_TIME_SHORT,
    GAME_POLLING_TIME_LONG,
    GAME_POLLING_TIME_SHORT,
    MAZE_ROWS,
    ALLOWED_MAZE_SIZES,
    DEFAULT_MAZE_SIZE,
    GAME_MODES,
    DEFAULT_GAME_MODE,
    GAME_THEME,
    UI_THEME,
    ALLOWED_CHARS,
    CHAR_LIMIT,
    MAX_TREASURES,
    MIN_TREASURES,
    MAX_PLAYERS,
    MIN_PLAYERS,
    CLICK_SOUND,
    TURN_SOUND,
    TREASURE_COLLECT_SOUND
};