import * as Config from "../data/config.js";

function isInputEmpty(str){
    return str === '' || str === undefined;
}

function isInputClean(str){
    for (const char of str.toLowerCase()) {
        if (!Config.ALLOWED_CHARS.includes(char)){
            return false;
        }
    }
    return true;
}

function isInputTooLarge(str){
    return str.length > Config.CHAR_LIMIT;
}

function isCountValid(count, min, max){
    return !isNaN(count) && count <= max && count >= min;
}

function isTreasureCountValid(treasureCount) {
    return isCountValid(treasureCount, Config.MIN_TREASURES, Config.MAX_TREASURES);
}

function isPlayerCountValid(playerCount) {
    return isCountValid(playerCount, Config.MIN_PLAYERS, Config.MAX_PLAYERS);
}

export { isInputTooLarge, isInputClean, isInputEmpty, isCountValid, isPlayerCountValid, isTreasureCountValid };