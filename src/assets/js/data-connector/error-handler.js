import * as Util from '../components/util.js';

function generateVisualAPIErrorInConsole(error){
    console.error('%c%s','background-color: red;color: white','! An error occurred while calling the API');
    console.table(error);
}

function handleError(error){
    if (error['cause'] !== undefined) {
        Util.renderErrorMessage(error['cause']);
    } else {
        Util.renderErrorMessage('No connection!');
        generateVisualAPIErrorInConsole(error);
    }
}

export { handleError };