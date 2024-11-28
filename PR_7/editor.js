const editorElement = document.getElementById('editor');
const saveButton = document.getElementById('saveButton');
const playButton = document.getElementById('playButton');
const mazeArrayElement = document.getElementById('mazeArray');


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

function drawEditor() {
    editorElement.innerHTML = '';
    for (let row = 0; row < maze.length; row++) {
        for (let col = 0; col < maze[row].length; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            if (maze[row][col] === 1) {
                cell.classList.add('wall');
            }
            cell.addEventListener('click', () => {
                maze[row][col] = maze[row][col] === 1 ? 0 : 1; 
                drawEditor();
                displayMazeArray();
            });
            editorElement.appendChild(cell);
        }
    }
    displayMazeArray(); 
}


function displayMazeArray() {
    mazeArrayElement.innerHTML = ''; 
    maze.forEach(row => {
        mazeArrayElement.innerHTML += row.join(' ') + '\n'; 
    });
}


saveButton.addEventListener('click', () => {
    localStorage.setItem('maze', JSON.stringify(maze)); 
    alert('Лабиринт сохранен!');
});


playButton.addEventListener('click', () => {
    window.location.href = 'index.html';
});

drawEditor();
