import * as Config from './config.js';

const CLICK = new Audio(`assets/audio/${Config.GAME_THEME}/click.mp3`);
const LEVEL_UP = new Audio(`assets/audio/${Config.GAME_THEME}/level-up.mp3`);
const ACHIEVEMENT = new Audio(`assets/audio/${Config.GAME_THEME}/achievement.mp3`);

export { CLICK, LEVEL_UP, ACHIEVEMENT };