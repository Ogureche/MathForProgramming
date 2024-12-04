// Настройка игрового поля
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

// Переменные игры
let spaceship = { x: 375, y: 500, width: 50, height: 50 };
let spaceshipColor = 'blue'; // Цвет звездолёта
let rockets = [];
let comets = [];
let score = 0;
let reloadTime = 0;
let gameStarted = false; // Игра ещё не началась
let gameOver = false; // Игра не окончена

// Управление клавишами
const keys = { ArrowLeft: false, ArrowRight: false, ArrowUp: false, ArrowDown: false, Space: false, Enter: false };
window.addEventListener('keydown', (e) => {
  keys[e.key] = true;
  if (e.key === "Enter") {
    if (!gameStarted) startGame(); // Начать игру
    if (gameOver) restartGame(); // Перезапуск игры
  }
});
window.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

// Функция рисования звездолёта
function drawSpaceship() {
  ctx.fillStyle = spaceshipColor; // Используем переменную для цвета
  ctx.fillRect(spaceship.x, spaceship.y, spaceship.width, spaceship.height);
}

// Движение звездолёта
function moveSpaceship() {
  if (keys.ArrowLeft && spaceship.x > 0) spaceship.x -= 5;
  if (keys.ArrowRight && spaceship.x < canvas.width - spaceship.width) spaceship.x += 5;
  if (keys.ArrowUp && spaceship.y > 0) spaceship.y -= 5;
  if (keys.ArrowDown && spaceship.y < canvas.height - spaceship.height) spaceship.y += 5;
}

// Стрельба ракетами
function shootRocket() {
  if (keys[" "] && reloadTime === 0 && rockets.length < 3) {
    rockets.push({ x: spaceship.x + spaceship.width / 2 - 2.5, y: spaceship.y, width: 5, height: 10 });
    reloadTime = 30; // Задержка между выстрелами
  }
  if (reloadTime > 0) reloadTime--;
}

// Рисование и движение ракет
function drawRockets() {
  ctx.fillStyle = 'red';
  rockets.forEach((rocket, index) => {
    rocket.y -= 10; // Движение вверх
    ctx.fillRect(rocket.x, rocket.y, rocket.width, rocket.height);

    // Удаляем ракету, если она вышла за пределы экрана
    if (rocket.y < 0) rockets.splice(index, 1);
  });
}

// Генерация комет
function spawnComets() {
  if (Math.random() < 0.02) {
    comets.push({ x: Math.random() * (canvas.width - 50), y: -50, width: 50, height: 50, speed: 2 + Math.random() * 3 });
  }
}

// Рисование комет
function drawComets() {
  ctx.fillStyle = 'gray';
  comets.forEach((comet, index) => {
    comet.y += comet.speed;
    ctx.fillRect(comet.x, comet.y, comet.width, comet.height);
    if (comet.y > canvas.height) comets.splice(index, 1);
  });
}

// Проверка столкновений
function checkCollisions() {
  comets.forEach((comet, cometIndex) => {
    // Столкновение с ракетами
    rockets.forEach((rocket, rocketIndex) => {
      if (
        rocket.x < comet.x + comet.width &&
        rocket.x + rocket.width > comet.x &&
        rocket.y < comet.y + comet.height &&
        rocket.y + rocket.height > comet.y
      ) {
        rockets.splice(rocketIndex, 1);
        comets.splice(cometIndex, 1);
        score += 10;
      }
    });

    // Столкновение со звездолётом
    if (
      spaceship.x < comet.x + comet.width &&
      spaceship.x + spaceship.width > comet.x &&
      spaceship.y < comet.y + comet.height &&
      spaceship.y + spaceship.height > comet.y
    ) {
      spaceshipColor = 'red'; // Изменяем цвет звездолёта на красный

      // Остановка игры с задержкой
      setTimeout(() => {
        endGame();
      }, 200); 
    }
  });
}


// Рисование счёта
function drawScore() {
  ctx.fillStyle = 'white';
  ctx.font = '20px Arial';
  const scoreText = 'Счёт: ' + score;
  const textWidth = ctx.measureText(scoreText).width; // Вычисляем ширину текста
  const x = canvas.width - textWidth - 20; // Смещаем от правого края
  ctx.fillText(scoreText, x, 20); // Рисуем текст
}

// Экран заставки
function drawStartScreen() {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'white';
  ctx.font = '30px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Добро пожаловать в игру!', canvas.width / 2, canvas.height / 2 - 30);
  ctx.fillText('Нажмите Enter, чтобы начать', canvas.width / 2, canvas.height / 2 + 20);
}

// Завершение игры
function endGame() {
  gameOver = true;
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'red';
  ctx.font = '30px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Игра окончена!', canvas.width / 2, canvas.height / 2 - 30);
  ctx.fillText('Ваш счёт: ' + score, canvas.width / 2, canvas.height / 2);
  ctx.fillText('Нажмите Enter, чтобы сыграть снова', canvas.width / 2, canvas.height / 2 + 50);
}

// Перезапуск игры
function restartGame() {
  gameOver = false;
  gameStarted = true;
  score = 0;
  spaceship = { x: 375, y: 500, width: 50, height: 50 };
  spaceshipColor = 'blue'; // Сбрасываем цвет звездолёта на синий
  rockets = [];
  comets = [];
  gameLoop();
}

// Запуск игры
function startGame() {
  gameStarted = true;
  gameOver = false;
  gameLoop();
}

// Основной игровой цикл
function gameLoop() {
  if (gameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  moveSpaceship();
  drawSpaceship();

  shootRocket();
  drawRockets();

  spawnComets();
  drawComets();

  checkCollisions();
  drawScore();

  requestAnimationFrame(gameLoop);
}

// Отображение экрана заставки при загрузке
drawStartScreen();
