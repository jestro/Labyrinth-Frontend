import * as Requests from '../api/api-requests.js';
import * as ScreenManager from '../components/screen-manager.js';
import * as Storage from '../components/local-storage.js';
import * as Handler from '../components/error-handler.js';

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

    checkUsername();

    if (Storage.loadFromStorage('username') !== null) {
        ScreenManager.switchToScreen(screen);
    }
}

function checkUsername(){
    const username = document.querySelector('#player-name').value;

    if (!Handler.renderInvalidNameError(username)) {
        Storage.saveToStorage('username', username);
    }
}

export { init };