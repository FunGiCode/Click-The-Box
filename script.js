window.addEventListener("resize", () => {
    document.querySelector("html").scrollTop = 0;
}) 

//Global variable
var SCORE = 0;
var LEVEL = -1;

// DOM ELEMENTS
const gameScreen = document.querySelector(".screen");
const timer = document.querySelector("p.timer");

const startingText = document.querySelector(".startingText");
const levelWrapper = document.querySelector(".levelWrapper");
const levelBtns = Array.from(levelWrapper.children);

const repeatBtn = document.querySelector(".repeatBtn");

const box = document.querySelector(".box");
const boxScore = document.querySelector("p.score");
const endScore = document.querySelector("p.endScore");

//Reusable Functions

var HIDE_ELEMENT_MODE = "HIDE ELEMENT";
var SHOW_ELEMENT_MODE = "SHOW ELEMENT";

function hideOrShowElement(el, mode) {
    if (mode === HIDE_ELEMENT_MODE)
        el.classList.add("hide");
    else if (mode === SHOW_ELEMENT_MODE)
        el.classList.remove("hide");
    else
        console.error("THE MODE IS UNDEFINED...");
}


// GAME LOGIC

function startGame(level) {
    LEVEL = parseInt(level);

    //HIDE ELEMENT
    hideOrShowElement(startingText, HIDE_ELEMENT_MODE);
    hideOrShowElement(levelWrapper, HIDE_ELEMENT_MODE);

    //show elements
    hideOrShowElement(box, SHOW_ELEMENT_MODE);

    //create the map grid using the LEVEL global variable
    createMap();

    //create a timer
    stopWatch(timer, 10);
}

function boxIsClicked() {
    //change box position randomly
    changeBoxPosition(LEVEL + 1);
    //update the score --> increment it by 1
    updateScore(boxScore);
    //change box color randomly per click
    changeColorOnClick();
}

var previousRandomRow = -1;
var previousRandomColumn = -1;

function changeBoxPosition(max = 2) {
    let randRow = Math.floor(Math.random() * (max)) + 1;   
    let randColumn = Math.floor(Math.random() * (max)) + 1;   

    // prevent the box of spawning in the same place twice
    if (previousRandomRow === randRow && previousRandomColumn === randColumn)
        return changeBoxPosition(max);
    else {
        previousRandomRow = randRow;
        previousRandomColumn = randColumn;
    }


    box.style.gridRowStart = `${randRow}`;
    box.style.gridColumnStart = `${randColumn}`;
}

function updateScore(textElement) {
    SCORE++;
    textElement.innerText = SCORE;
}

const colors = ["red", "blue", "green", "black", "purple"];

function changeColorOnClick() {
    let randIndex = Math.floor(Math.random() * (colors.length));
    box.style.backgroundColor = colors[randIndex];
}

//create the map --> rows === columns
function createMap() {
    let rowsAndColumns;
    switch (LEVEL) {
        case 1: rowsAndColumns = 2;
            break;
        case 2: rowsAndColumns = 3;
            break;
        case 3: rowsAndColumns = 4;
            break;
        default: console.error("The level assigned is undefined!");
    }

    gameScreen.style.gridTemplateColumns = `repeat(${rowsAndColumns},1fr)`;
    gameScreen.style.gridTemplateRows = `repeat(${rowsAndColumns},1fr)`;
}

function roundIsFinished() {
    //HIDE THE BOX
    box.classList.add("hide");
    //DISPLAY THE ENDSCORE
    endScore.innerText = "SCORE: " + SCORE;
    hideOrShowElement(endScore, SHOW_ELEMENT_MODE);
    //DISPLAY REPEAT BTN
    hideOrShowElement(repeatBtn, SHOW_ELEMENT_MODE);
}

function repeatGame() {
    //reset score from everywhere
    boxScore.innerText = 0;
    endScore.innerText = "SCORE: " + 0;
    SCORE = 0;

    //Reset game UI

    hideOrShowElement(levelWrapper, SHOW_ELEMENT_MODE);
    hideOrShowElement(repeatBtn, HIDE_ELEMENT_MODE);
    hideOrShowElement(endScore, HIDE_ELEMENT_MODE);
    hideOrShowElement(startingText, SHOW_ELEMENT_MODE);
}


// STOP WATCH SETTINGS

function stopWatch(textElement, seconds) {
    if (seconds > 0) {
        seconds--;
        textElement.innerText = seconds + "s";
        setTimeout(stopWatch.bind(this,textElement,seconds), 1000);
    } else {
        textElement.innerText = textElement.getAttribute("data-time") + "s";
        return roundIsFinished();
    }
}
//Event listeners


box.addEventListener("click", boxIsClicked);

repeatBtn.addEventListener("click", repeatGame);

levelBtns.forEach(btn => {
    btn.addEventListener("click", startGame.bind(this,btn.getAttribute("data-level")))
})