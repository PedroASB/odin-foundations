function createRow(rowHeight) {
    let row = document.createElement("div");
    row.classList.add("row");
    row.style.height = rowHeight;
    return row;
}

function createSquare(width, squareBorder) {
    let square = document.createElement("div");
    square.classList.add("square");
    square.style.width = square.style.height = width;
    square.style.border = `${squareBorder}px solid lightgray`;
    square.addEventListener("mouseenter", paintSquare);
    return square;
}

function paintSquare(event) {
    event.target.style.backgroundColor = PAINTED_SQUARE_COLOR;
}

function addSquares(row, numberOfColumns, squareWidth, squareBorder) {
    for (let i = 0; i < numberOfColumns; i++) {
        let square = createSquare(squareWidth, squareBorder);
        row.appendChild(square);
    }
}

function createGrid(gridSize, squareBorder) {
    let grid = document.querySelector("div#grid");
    let gridStyle = getComputedStyle(grid);

    let rowHeight = `${parseInt(gridStyle.height) / gridSize}px`;
    let squareWidth = `${(parseInt(gridStyle.width) / gridSize) - squareBorder}px`;

    // reset grid
    grid.innerHTML = "";

    for (let i = 0; i < gridSize; i++) {
        let row = createRow(rowHeight);
        addSquares(row, gridSize, squareWidth, squareBorder);
        grid.appendChild(row);
    }

}

function newGrid() {
    let gridSize = prompt("Enter new grid size:");
    createGrid(gridSize, squareBorder);
}

// Begin
const initialGridSize = 16, squareBorder = 1;
const EMPTY_SQUARE_COLOR = "white"; // "rgb(163, 163, 163)"
const PAINTED_SQUARE_COLOR = "black"; // "rgb(24, 24, 24)"

createGrid(initialGridSize, squareBorder);

let newGridButton = document.querySelector("button#new-grid-btn");
newGridButton.addEventListener("click", newGrid);
