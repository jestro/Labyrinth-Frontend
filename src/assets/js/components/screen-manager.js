import * as Board from '../screens/game-page/board.js';
import * as EndScreen from '../screens/end-screen.js';
import * as GameLobby from '../screens/index-page/game-lobby.js';
import * as GamesList from '../screens/index-page/games-list.js';
import * as HostGame from '../screens/index-page/host-game.js';
import * as StartScreen from '../screens/index-page/start-screen.js';

function init() {
    hideAllScreens();
    document.querySelector('.screen').classList.remove('hidden');
    initScreen(getCurrentScreen());
}

// Returns if it was successful (boolean)
function switchToScreen(screen) {
    const $screen = document.querySelector(`.screen#${screen}`);
    if ($screen === null) return false;
    hideCurrentScreen();
    $screen.classList.remove('hidden');
    initScreen($screen.id);
}

function switchToPage(page){
    window.location.href = `./${page}.html`;
}

function getCurrentScreen() {
    return document.querySelector('.screen:not(.hidden)').id;
}

/* Add your page HERE and add import
*  case '<id>' from html .screen element
* */
function initScreen(screen) {
    switch (screen) {
        case 'start-screen':   StartScreen.init();        break;
        case 'board':          Board.init();              break;
        case 'games-list':     GamesList.init();          break;
        case 'host-game':      HostGame.init();           break;
        case 'game-lobby':     GameLobby.init();          break;
        case 'end-screen':     EndScreen.init();          break;
        default:                                          break;
    }
}

function hideAllScreens() {
    document.querySelectorAll('.screen').forEach(($screen) => {
        $screen.classList.add('hidden');
    });
}

function hideCurrentScreen() {
    document.querySelector('.screen:not(.hidden)').classList.add('hidden');
}

export { init, getCurrentScreen, switchToScreen, switchToPage };
