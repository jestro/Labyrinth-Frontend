import * as Config from './config.js';

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

function isInputValid(str) {
    return !isInputEmpty(str) && !isInputTooLarge(str) && isInputClean(str);
}

function inputErrorMessage(str) {
    if(isInputEmpty(str)) {
        return 'No empty name';
    } else if (!isInputClean(str)) {
        return 'No illegal characters allowed in name';
    } else if (isInputTooLarge(str)) {
        return 'Maximum characters is ' + Config.CHAR_LIMIT;
    } else {
        return null;
    }
}

function renderErrorMessage(error) {
    const $error = document.querySelector(Config.ERRORHANDLER_SELECTOR);
    if($error !== null){
        $error.innerText = error;
        $error.classList.remove("hidden");
    }

    setTimeout(clearErrorMessage, Config.UI_POLLING_TIME_LONG);
}

function clearErrorMessage() {
    const $error = document.querySelector(Config.ERRORHANDLER_SELECTOR);
    $error.innerText = '';
    $error.classList.add("hidden");
}

function createOptionElement(content, value){
    const $option = document.createElement('option');
    $option.value = value;
    $option.innerText = content;
    return $option;
}

function isOdd(x) {
    return (x + 1) % 2 === 0;
}

export { isInputTooLarge, isInputClean, isInputEmpty, isInputValid, isCountValid, inputErrorMessage, renderErrorMessage, clearErrorMessage, createOptionElement, isOdd };