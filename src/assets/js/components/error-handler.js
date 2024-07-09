import * as Config from "../data/config.js";
import * as Validate from './input-validation.js';

function handleAPIError(error){
    if (error['cause'] !== undefined) {
        renderErrorMessage(error['cause']);
    } else {
        renderErrorMessage('No connection!');
    }

    showConsoleError(error);
}

function showConsoleError(error){
    console.error('%c%s','background-color: red;color: white','! An error occurred while calling the API');
    console.table(error);
}

function renderErrorMessage(error) {
    const $error = document.querySelector(Config.ERRORHANDLER_SELECTOR);
    if($error !== null){
        $error.innerText = error;
        $error.classList.remove("hidden");
    }

    setTimeout(clearErrorMessage, Config.UI_POLLING_TIME_LONG);
}

function renderInvalidNameError(str) {
    if(Validate.isInputEmpty(str)) {
        renderErrorMessage('No empty name');
        return true;
    } else if (!Validate.isInputClean(str)) {
        renderErrorMessage('No illegal characters allowed in name');
        return true;
    } else if (Validate.isInputTooLarge(str)) {
        renderErrorMessage(`Maximum characters is ${Config.CHAR_LIMIT}`);
        return true;
    }

    return false;
}

function renderGameOptionsError(playerCount, treasureCount) {
    if (!Validate.isPlayerCountValid(playerCount)) {
        renderErrorMessage(`Invalid player count. (${Config.MIN_PLAYERS}-${Config.MAX_PLAYERS})`);
        return true;
    } else if (!Validate.isTreasureCountValid(treasureCount)) {
        renderErrorMessage(`Invalid treasure goal. (${Config.MIN_TREASURES}-${Config.MAX_TREASURES})`);
        return true;
    }

    return false;
}

function clearErrorMessage() {
    const $error = document.querySelector(Config.ERRORHANDLER_SELECTOR);
    $error.innerText = '';
    $error.classList.add("hidden");
}

export { handleAPIError, renderErrorMessage, renderInvalidNameError, renderGameOptionsError, clearErrorMessage };