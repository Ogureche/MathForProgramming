const rows = 6;
const cols = 6;
let gameField = Array.from({ length: rows }, () => Array(cols).fill(0));
let shipsCount = 3;

function placeShips(numShips) {
    let placedShips = 0;

    while (placedShips < numShips) {
        const row = Math.floor(Math.random() * rows);
        const col = Math.floor(Math.random() * cols);

        if (gameField[row][col] === 0) {
            gameField[row][col] = 1; 
            placedShips++;
        }
    }
}

function createBoard() {
    const gameBoard = document.getElementById('gameBoard');
    gameBoard.innerHTML = '';

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.addEventListener('click', () => shoot(row, col));
            gameBoard.appendChild(cell);
        }
    }
}

function displayArray() {
    const arrayDisplay = document.getElementById('arrayDisplay');
    let displayString = '';

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            displayString += gameField[row][col] + ' ';
        }
        displayString += '\n'; 
    }

    arrayDisplay.textContent = displayString;
}

function shoot(row, col) {
    const cell = document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);

    if (gameField[row][col] === 1) {
        cell.classList.add('hit');
        cell.textContent = 'X';
        document.getElementById('message').textContent = "Попадание!";
        gameField[row][col] = 2; 
    } else if (gameField[row][col] === 0) {
        cell.classList.add('miss');
        cell.textContent = 'O';
        document.getElementById('message').textContent = "Мимо!";
        gameField[row][col] = -1; 
    } else {
        document.getElementById('message').textContent = "Эта ячейка уже была обстреляна.";
    }

    displayArray(); 
}


placeShips(shipsCount);
createBoard();
displayArray(); 
