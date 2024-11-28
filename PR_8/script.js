const maze = [
    [0, 1, 0, 0, 0, 0],
    [0, 1, 0, 1, 1, 0],
    [0, 0, 0, 1, 0, 0],
    [0, 1, 1, 1, 0, 1],
    [0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 0]
];

const start = { x: 0, y: 0 }; 
const end = { x: 5, y: 5 };   
function createMaze() {
    const mazeContainer = document.getElementById('maze');
    mazeContainer.innerHTML = '';

    for (let i = 0; i < maze.length; i++) {
        for (let j = 0; j < maze[i].length; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            if (maze[i][j] === 1) {
                cell.classList.add('wall');
            }
            if (i === start.x && j === start.y) {
                cell.classList.add('start');
            }
            if (i === end.x && j === end.y) {
                cell.classList.add('end');
            }
            mazeContainer.appendChild(cell);
        }
    }
}

function heuristic(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function aStar(maze, start, end) {
    const openSet = [];
    const closedSet = new Set();
    openSet.push(start);

    const cameFrom = new Map();
    const gScore = new Map();
    const fScore = new Map();

    gScore.set(`${start.x},${start.y}`, 0);
    fScore.set(`${start.x},${start.y}`, heuristic(start, end));

    while (openSet.length > 0) {
        let current = openSet.reduce((prev, curr) => {
            return (fScore.get(`${curr.x},${curr.y}`) < fScore.get(`${prev.x},${prev.y}`) ? curr : prev);
        });

        if (current.x === end.x && current.y === end.y) {
            const path = [];
            let temp = current;
            while (temp) {
                path.push(temp);
                temp = cameFrom.get(`${temp.x},${temp.y}`);
            }
            return path.reverse();
        }

        openSet.splice(openSet.indexOf(current), 1);
        closedSet.add(`${current.x},${current.y}`);

        const neighbors = [
            { x: current.x + 1, y: current.y },
            { x: current.x - 1, y: current.y },
            { x: current.x, y: current.y + 1 },
            { x: current.x, y: current.y - 1 }
        ];

        for (const neighbor of neighbors) {
            if (neighbor.x < 0 || neighbor.x >= maze.length || neighbor.y < 0 || neighbor.y >= maze[0].length) {
                continue; 
            }
            if (maze[neighbor.x][neighbor.y] === 1 || closedSet.has(`${neighbor.x},${neighbor.y}`)) {
                continue; 
            }

            const tentativeGScore = gScore.get(`${current.x},${current.y}`) + 1;

            if (!openSet.includes(neighbor)) {
                openSet.push(neighbor);
            } else if (tentativeGScore >= (gScore.get(`${neighbor.x},${neighbor.y}`) || Infinity)) {
                continue; 
            }

            cameFrom.set(`${neighbor.x},${neighbor.y}`, current);
            gScore.set(`${neighbor.x},${neighbor.y}`, tentativeGScore);
            fScore.set(`${neighbor.x},${neighbor.y}`, tentativeGScore + heuristic(neighbor, end));
        }
    }

    return []; 
}

function visualizePath(path) {
    const mazeContainer = document.getElementById('maze');
    path.forEach(cell => {
        const index = cell.x * maze[0].length + cell.y;
        const mazeCells = mazeContainer.getElementsByClassName('cell');
        mazeCells[index].classList.add('path');
    });
}

function movePlayer(path) {
    const player = document.createElement('div');
    player.classList.add('player');
    const mazeContainer = document.getElementById('maze');
    mazeContainer.appendChild(player);

    let index = 0;
    const startTime = Date.now(); 

    function animate() {
        if (index < path.length) {
            const cell = path[index];
            const x = cell.y * 40; 
            const y = cell.x * 42; 
            player.style.transform = `translate(${x}px, ${y}px)`; 
            index++;
            setTimeout(animate, 500); 
        } else {
            const endTime = Date.now(); //время
            const duration = (endTime - startTime) / 1000; 
            const pathLength = path.length; 
            const steps = path.length - 1; 


            console.log("Время прохождения:", duration, "секунд");
            console.log("Длина пути:", pathLength);
            console.log("Количество шагов:", steps);

            const resultsDiv = document.createElement('div');
            resultsDiv.innerHTML = `
                <h3>Результаты:</h3>
                <p>Время прохождения: ${duration.toFixed(2)} секунд</p>
                <p>Длина пути: ${pathLength}</p>
                <p>Количество шагов: ${steps}</p>
            `;
            document.body.appendChild(resultsDiv);
        }
    }


    player.style.transform = `translate(${start.y * 40}px, ${start.x * 40}px)`;
    animate();
}

document.getElementById('startButton').addEventListener('click', () => {
    const path = aStar(maze, start, end);
    if (path.length > 0) {
        console.log("Найденный путь:", path);
        console.log("Длина пути:", path.length);
        visualizePath(path);
        movePlayer(path); 
    } else {
        console.log("Путь не найден.");
    }
});

createMaze();
