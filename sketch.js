let cols = 10;
let rows = 10;
let w = 40;
let grid = [];
let current;
let stack = [];
let player;
let goal;

function setup() {
  createCanvas(cols * w, rows * w);
  frameRate(30);

  // Create grid
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      grid.push(new Cell(x, y));
    }
  }

  current = grid[0];
  generateMaze();
  player = createVector(0, 0);
  goal = createVector(cols - 1, rows - 1);
}

function draw() {
  background(51);
  for (let cell of grid) {
    cell.show();
  }

  fill('lime');
  noStroke();
  rect(player.x * w + 5, player.y * w + 5, w - 10, w - 10);

  fill('gold');
  rect(goal.x * w + 10, goal.y * w + 10, w - 20, w - 20);
}

function keyPressed() {
  let index = player.y * cols + player.x;
  let cell = grid[index];

  if (keyCode === UP_ARROW && !cell.walls[0]) player.y--;
  if (keyCode === RIGHT_ARROW && !cell.walls[1]) player.x++;
  if (keyCode === DOWN_ARROW && !cell.walls[2]) player.y++;
  if (keyCode === LEFT_ARROW && !cell.walls[3]) player.x--;

  player.x = constrain(player.x, 0, cols - 1);
  player.y = constrain(player.y, 0, rows - 1);

  if (player.x === goal.x && player.y === goal.y) {
    alert("You win!");
    noLoop();
  }
}

function generateMaze() {
  current.visited = true;
  while (true) {
    let next = current.checkNeighbors();
    if (next) {
      next.visited = true;
      stack.push(current);
      removeWalls(current, next);
      current = next;
    } else if (stack.length > 0) {
      current = stack.pop();
    } else {
      break;
    }
  }
}

function index(x, y) {
  if (x < 0 || y < 0 || x >= cols || y >= rows) return -1;
  return x + y * cols;
}

function removeWalls(a, b) {
  let x = a.x - b.x;
  if (x === 1) { a.walls[3] = false; b.walls[1] = false; }
  else if (x === -1) { a.walls[1] = false; b.walls[3] = false; }

  let y = a.y - b.y;
  if (y === 1) { a.walls[0] = false; b.walls[2] = false; }
  else if (y === -1) { a.walls[2] = false; b.walls[0] = false; }
}

class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.walls = [true, true, true, true];
    this.visited = false;
  }

  checkNeighbors() {
    let neighbors = [];
    let top = grid[index(this.x, this.y - 1)];
    let right = grid[index(this.x + 1, this.y)];
    let bottom = grid[index(this.x, this.y + 1)];
    let left = grid[index(this.x - 1, this.y)];

    if (top && !top.visited) neighbors.push(top);
    if (right && !right.visited) neighbors.push(right);
    if (bottom && !bottom.visited) neighbors.push(bottom);
    if (left && !left.visited) neighbors.push(left);

    if (neighbors.length > 0) {
      return random(neighbors);
    } else {
      return undefined;
    }
  }

  show() {
    let x = this.x * w;
    let y = this.y * w;
    stroke(255);
    if (this.walls[0]) line(x, y, x + w, y);         // top
    if (this.walls[1]) line(x + w, y, x + w, y + w); // right
    if (this.walls[2]) line(x + w, y + w, x, y + w); // bottom
    if (this.walls[3]) line(x, y + w, x, y);         // left

    if (this.visited) {
      noStroke();
      fill(100, 0, 255, 50);
      rect(x, y, w, w);
    }
  }
}
