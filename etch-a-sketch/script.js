function getRandomRGB(opacity=1.0) {
    let red = parseInt(Math.random() * 1000 % 257);
    let green = parseInt(Math.random() * 1000 % 257);
    let blue = parseInt(Math.random() * 1000 % 257);
    return `rgba(${red}, ${green}, ${blue}, ${opacity})`;
}

function createRow(rowHeight) {
    let row = document.createElement("div");
    row.classList.add("row");
    row.style.height = rowHeight;
    return row;
}

function createSquare(width) {
    let square = document.createElement("div");
    square.classList.add("square");
    square.style.width = square.style.height = width;
    square.style.border = SQUARE_BORDER;
    square.style.backgroundColor = EMPTY_COLOR;
    square.addEventListener("mouseenter", paintSquare);
    return square;
}

function increaseOpacity(element) {
    let red, green, blue, alpha;
    [red, green, blue, alpha] = element.style.backgroundColor.match(/[0-9]+(.[0-9]+)?/g);
    if (alpha === undefined) alpha = 1.0;
    else if (alpha < 1.0) alpha = parseFloat(alpha) + 0.1;
    element.style.backgroundColor = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function paintSquare(event) {
    if (event.shiftKey) {
        event.target.style.backgroundColor = EMPTY_COLOR;
        return;
    }

    if (!colorful && !darkening) {
        event.target.style.backgroundColor = BLACK_COLOR;
    }
    else if (!colorful && darkening) {
        increaseOpacity(event.target);
    }
    else if (colorful && !darkening) {
        event.target.style.backgroundColor = getRandomRGB();
    }
    else if (colorful && darkening) {
        if (event.target.style.backgroundColor === EMPTY_COLOR)
            event.target.style.backgroundColor = getRandomRGB(0.1);
        else
            increaseOpacity(event.target);
    } 
    
}

function addSquares(row, numberOfColumns, squareWidth) {
    for (let i = 0; i < numberOfColumns; i++) {
        let square = createSquare(squareWidth);
        row.appendChild(square);
    }
}

function createGrid(gridSize, squareBorderSize) {
    let grid = document.querySelector("div#grid");
    let gridStyle = getComputedStyle(grid);

    let rowHeight = `${parseInt(gridStyle.height) / gridSize}px`;
    let squareWidth = `${(parseInt(gridStyle.width) / gridSize) - squareBorderSize}px`;

    // Reset grid
    grid.innerHTML = "";

    for (let i = 0; i < gridSize; i++) {
        let row = createRow(rowHeight);
        addSquares(row, gridSize, squareWidth);
        grid.appendChild(row);
    }

}

function newGrid() {
    let gridSize = prompt("Enter new grid size:");
    colorful = confirm("Colorful mode?");
    darkening = confirm("Darkening mode?");
    createGrid(gridSize, squareBorderSize);
}


// Begin
const EMPTY_COLOR = "rgba(0, 0, 0, 0)";
const BLACK_COLOR = "rgba(0, 0, 0, 1)";
const initialGridSize = 16
const squareBorderSize = 1;
const SQUARE_BORDER = `${squareBorderSize}px solid lightgrey`;

let colorful = false;
let darkening = false;

createGrid(initialGridSize, squareBorderSize);

let newGridButton = document.querySelector("button#new-grid-btn");
let gridLinesButton = document.querySelector("button#grid-lines-btn");

newGridButton.addEventListener("click", newGrid);
