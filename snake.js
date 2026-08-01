const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
 
const cellSize = 20;
const gridCount = canvas.width / cellSize; // 20x20 grid
 
const scoreEl = document.getElementById('score');
const bestEl = document.getElementById('best');
const messageEl = document.getElementById('message');
const restartBtn = document.getElementById('restartBtn');
 
let snake, direction, nextDirection, food, score, best = 0, isRunning, gameLoop;
 
function init() {
  snake = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 }
  ];
  direction = { x: 1, y: 0 };
  nextDirection = { x: 1, y: 0 };
  food = placeFood();
  score = 0;
  scoreEl.textContent = score;
  messageEl.textContent = 'Use arrow keys or WASD to move';
  isRunning = true;
}
 
function placeFood() {
  let position;
  while (true) {
    position = {
      x: Math.floor(Math.random() * gridCount),
      y: Math.floor(Math.random() * gridCount)
    };
    const onSnake = snake.some(seg => seg.x === position.x && seg.y === position.y);
    if (!onSnake) break;
  }
  return position;
}
 
function draw() {
  // background
  ctx.fillStyle = '#12121f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
 
  // food
  ctx.fillStyle = '#ff6b6b';
  ctx.fillRect(food.x * cellSize + 2, food.y * cellSize + 2, cellSize - 4, cellSize - 4);
 
  // snake
  snake.forEach((segment, index) => {
    ctx.fillStyle = index === 0 ? '#7cf29c' : '#4bb679';
    ctx.fillRect(segment.x * cellSize + 1, segment.y * cellSize + 1, cellSize - 2, cellSize - 2);
  });
}
 
function update() {
  if (!isRunning) return;
 
  direction = nextDirection;
  const head = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y
  };
 
  // wall collision
  const hitWall = head.x < 0 || head.x >= gridCount || head.y < 0 || head.y >= gridCount;
  // self collision
  const hitSelf = snake.some(seg => seg.x === head.x && seg.y === head.y);
 
  if (hitWall || hitSelf) {
    isRunning = false;
    messageEl.textContent = 'Game over — press Restart or an arrow key to play again';
    if (score > best) {
      best = score;
      bestEl.textContent = best;
    }
    return;
  }
 
  snake.unshift(head);
 
  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreEl.textContent = score;
    food = placeFood();
  } else {
    snake.pop();
  }
 
  draw();
}
 
function changeDirection(x, y) {
  if (!isRunning) {
    init();
    draw();
    return;
  }
  // prevent reversing directly into itself
  if (direction.x === -x && direction.y === -y) return;
  nextDirection = { x, y };
}
 
// keyboard controls
document.addEventListener('keydown', (e) => {
  const key = e.key.toLowerCase();
  if (key === 'arrowup' || key === 'w') changeDirection(0, -1);
  else if (key === 'arrowdown' || key === 's') changeDirection(0, 1);
  else if (key === 'arrowleft' || key === 'a') changeDirection(-1, 0);
  else if (key === 'arrowright' || key === 'd') changeDirection(1, 0);
  else return;
  e.preventDefault();
});
 
// on-screen button controls
document.getElementById('up').addEventListener('click', () => changeDirection(0, -1));
document.getElementById('down').addEventListener('click', () => changeDirection(0, 1));
document.getElementById('left').addEventListener('click', () => changeDirection(-1, 0));
document.getElementById('right').addEventListener('click', () => changeDirection(1, 0));
 
restartBtn.addEventListener('click', () => {
  init();
  draw();
});
 
// start the game
init();
draw();
gameLoop = setInterval(update, 120);
 
