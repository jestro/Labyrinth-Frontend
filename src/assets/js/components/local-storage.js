function saveToStorage(key, value) {
  if (localStorage) {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

function deleteFromStorage(key) {
  if (localStorage) {
    localStorage.removeItem(key);
  }
}

function clearStorage() {
  if (localStorage) {
    localStorage.clear();
  }
}

function loadFromStorage(key) {
  if (localStorage) {
    return JSON.parse(localStorage.getItem(key));
  }
  return null;
}

export { saveToStorage, loadFromStorage, deleteFromStorage, clearStorage };
