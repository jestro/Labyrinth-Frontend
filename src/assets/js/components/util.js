function createOptionElement(content, value){
    const $option = document.createElement('option');
    $option.value = value;
    $option.innerText = content;
    return $option;
}

function createParagraph(text) {
    const $p = document.createElement('p');
    $p.innerText = text;
    return $p;
}

function isOdd(x) {
    return (x + 1) % 2 === 0;
}

export { createOptionElement, isOdd, createParagraph };