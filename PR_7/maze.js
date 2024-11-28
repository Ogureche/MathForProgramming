const mazeElement = document.getElementById('maze');
const editButton = document.getElementById('editButton');

let maze = JSON.parse(localStorage.getItem('maze')) || [
    [0, 1, 0, 0, 0, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 1, 1, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 0, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
];

let playerPosition = { x: 0, y: 0 };

function drawMaze() {
    mazeElement.innerHTML = '';
    for (let row = 0; row < maze.length; row++) {
        for (let col = 0; col < maze[row].length; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            if (maze[row][col] === 1) {
                cell.classList.add('wall');
            }
            if (row === playerPosition.y && col === playerPosition.x) {
                cell.classList.add('player');
            }
            mazeElement.appendChild(cell);
        }
    }
}


function handleKeyPress(event) {
    const key = event.key;
    let newX = playerPosition.x;
    let newY = playerPosition.y;

    switch (key) {
        case 'ArrowUp':
            newY--;
            break;
        case 'ArrowDown':
            newY++;
            break;
        case 'ArrowLeft':
            newX--;
            break;
        case 'ArrowRight':
            newX++;
            break;
    }


    if (newX >= 0 && newX < maze[0].length && newY >= 0 && newY < maze.length && maze[newY][newX] === 0) {
        playerPosition.x = newX;
        playerPosition.y = newY;
        drawMaze();
    }
}


editButton.addEventListener('click', () => {
    window.location.href = 'editor.html'; 
});

drawMaze();
window.addEventListener('keydown', handleKeyPress);

