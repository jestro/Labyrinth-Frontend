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
        return;
    } else if (!Validate.isInputClean(str)) {
        renderErrorMessage('No illegal characters allowed in name');
        return;
    } else if (Validate.isInputTooLarge(str)) {
        renderErrorMessage(`Maximum characters is ${Config.CHAR_LIMIT}`);
        return;
    }

    return null;
}

function renderGameOptionsError(playerCount, treasureCount, gameName) {
    if (renderInvalidNameError(gameName) === null) {
        if (!Validate.isCountValid(playerCount, Config.MIN_PLAYERS, Config.MAX_PLAYERS)) {
            renderErrorMessage(`Invalid player count. (${Config.MIN_PLAYERS}-${Config.MAX_PLAYERS})`);
            return;
        } else if (!Validate.isCountValid(treasureCount, Config.MIN_TREASURES, Config.MAX_TREASURES)) {
            renderErrorMessage(`Invalid treasure goal. (${Config.MIN_TREASURES}-${Config.MAX_TREASURES})`);
            return;
        }
    } else {
        return renderInvalidNameError(gameName);
    }

    return null;
}

function clearErrorMessage() {
    const $error = document.querySelector(Config.ERRORHANDLER_SELECTOR);
    $error.innerText = '';
    $error.classList.add("hidden");
}

export { handleAPIError, renderErrorMessage, renderInvalidNameError, renderGameOptionsError, clearErrorMessage };