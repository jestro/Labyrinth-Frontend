import * as Requests from '../data-connector/api-requests.js';
import * as ScreenManager from '../components/screen-manager.js';
import * as Storage from '../data-connector/local-storage-abstractor.js';
import * as Util from '../components/util.js';

function init() {
    Requests.connectionTestApiInfo();
    Storage.clearStorage();
    bindEvents();
}

function bindEvents() {
    document.querySelector('#host').addEventListener('click', host);
    document.querySelector('#join').addEventListener('click', join);
    document.querySelectorAll('.go-to-start').forEach(($button) => {
        $button.addEventListener('click', goToStartScreen);
    });
}

function goToStartScreen(e) {
    e.preventDefault();
    ScreenManager.switchToScreen('start-screen');
}

function host(e) {
    navigate(e, 'host-game');
}

function join(e) {
    navigate(e, 'games-list');
}

function navigate(e, screen) {
    e.preventDefault();

    checkUsernameAndSave();

    if (Storage.loadFromStorage('username') !== null) {
        ScreenManager.switchToScreen(screen);
    }
}

function checkUsernameAndSave(){
    const username = document.querySelector('#player-name').value;

    if (!Util.isInputValid(username)) {
        Util.renderErrorMessage(Util.inputErrorMessage(username));
    } else {
        Storage.saveToStorage('username', username);
    }
}

export { init };