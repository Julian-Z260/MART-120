const mazeElement = document.getElementById('maze');
const rows = 10;
const cols = 10;
let maze = [];
let playerPos = { x: 0, y: 0 };

const DX = [0, 1, 0, -1];
const DY = [-1, 0, 1, 0];

function index(x, y) {
  return y * cols + x;
}

function createMazeGrid() {
  maze = Array(rows).fill().map(() =>
    Array(cols).fill().map(() => ({ visited: false, walls: [true, true, true, true] }))
  );
}

function removeWall(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;

  if (dx === 1) { maze[y1][x1].walls[1] = false; maze[y2][x2].walls[3] = false; }
  if (dx === -1) { maze[y1][x1].walls[3] = false; maze[y2][x2].walls[1] = false; }
  if (dy === 1) { maze[y1][x1].walls[2] = false; maze[y2][x2].walls[0] = false; }
  if (dy === -1) { maze[y1][x1].walls[0] = false; maze[y2][x2].walls[2] = false; }
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function generateMaze(x = 0, y = 0) {
  createMazeGrid();
  playerPos = { x: 0, y: 0 };

  const stack = [];
  maze[y][x].visited = true;
  stack.push({ x, y });

  while (stack.length > 0) {
    const current = stack.pop();
    const { x, y } = current;

    const neighbors = [];

    for (let i = 0; i < 4; i++) {
      const nx = x + DX[i];
      const ny = y + DY[i];
      if (nx >= 0 && ny >= 0 && nx < cols && ny < rows && !maze[ny][nx].visited) {
        neighbors.push({ x: nx, y: ny });
      }
    }

    shuffle(neighbors);

    if (neighbors.length > 0) {
      stack.push(current);
      const next = neighbors[0];
      removeWall(x, y, next.x, next.y);
      maze[next.y][next.x].visited = true;
      stack.push(next);
    }
  }

  drawMaze();
}

function drawMaze() {
  mazeElement.innerHTML = '';
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const div = document.createElement('div');
      div.className = 'cell';
      const cell = maze[y][x];

      if (cell.walls.includes(true)) div.classList.add('wall');
      if (x === playerPos.x && y === playerPos.y) div.classList.add('player');
      if (x === cols - 1 && y === rows - 1) div.classList.add('goal');

      mazeElement.appendChild(div);
    }
  }
}

function movePlayer(dx, dy) {
  const x = playerPos.x;
  const y = playerPos.y;
  const cell = maze[y][x];

  const dir = (dx === 1) ? 1 : (dx === -1) ? 3 : (dy === 1) ? 2 : 0;

  if (!cell.walls[dir]) {
    playerPos.x += dx;
    playerPos.y += dy;
    drawMaze();

    if (playerPos.x === cols - 1 && playerPos.y === rows - 1) {
      setTimeout(() => alert('You win!'), 100);
    }
  }
}

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowUp') movePlayer(0, -1);
  if (e.key === 'ArrowDown') movePlayer(0, 1);
  if (e.key === 'ArrowLeft') movePlayer(-1, 0);
  if (e.key === 'ArrowRight') movePlayer(1, 0);
});

generateMaze();
