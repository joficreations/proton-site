// script.js

const size = 10;
let maze = [];
let playerPos = { x: 0, y: 0 };
let startTime = null;

const mazeContainer = document.createElement("div");
mazeContainer.id = "maze-container";
mazeContainer.style.display = "none";
document.body.appendChild(mazeContainer);

const gameTitle = document.createElement("h2");
gameTitle.textContent = "Protonens labyrint";
gameTitle.style.textAlign = "center";
document.body.appendChild(gameTitle);

const gameInstructions = document.createElement("p");
gameInstructions.textContent =
  "Hjälp protonen hitta ut ur labyrinten så snabbt du kan! Använd piltangenterna.";
gameInstructions.style.textAlign = "center";
document.body.appendChild(gameInstructions);

gameTitle.style.display = "none";
gameInstructions.style.display = "none";

const startButton = document.createElement("button");
startButton.textContent = "Starta spelet";
startButton.style.display = "block";
startButton.style.margin = "2rem auto";
startButton.style.padding = "1rem 2rem";
startButton.style.fontSize = "1.2rem";
startButton.style.backgroundColor = "#5A3E36";
startButton.style.color = "white";
startButton.style.border = "none";
startButton.style.borderRadius = "8px";
startButton.style.cursor = "pointer";
document.body.appendChild(startButton);

startButton.addEventListener("click", () => {
  startGame();
  startButton.style.display = "none";
  mazeContainer.style.display = "grid";
  gameTitle.style.display = "block";
  gameInstructions.style.display = "block";
});

function generateMaze() {
  maze = Array.from({ length: size }, () => Array(size).fill(1));
  function carve(x, y) {
    const dirs = [
      [0, -2],
      [0, 2],
      [-2, 0],
      [2, 0],
    ].sort(() => Math.random() - 0.5);

    for (const [dx, dy] of dirs) {
      const nx = x + dx,
        ny = y + dy;
      if (nx >= 0 && ny >= 0 && nx < size && ny < size && maze[ny][nx] === 1) {
        maze[ny][nx] = 0;
        maze[y + dy / 2][x + dx / 2] = 0;
        carve(nx, ny);
      }
    }
  }

  maze[1][1] = 0;
  carve(1, 1);
  maze[size - 2][size - 2] = 0;
}

function drawMaze() {
  mazeContainer.innerHTML = "";
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      if (maze[y][x] === 1) cell.classList.add("wall");
      if (x === playerPos.x && y === playerPos.y) cell.classList.add("player");
      if (x === size - 2 && y === size - 2) cell.classList.add("exit");
      mazeContainer.appendChild(cell);
    }
  }
}

function movePlayer(dx, dy) {
  const nx = playerPos.x + dx;
  const ny = playerPos.y + dy;
  if (nx >= 0 && ny >= 0 && nx < size && ny < size && maze[ny][nx] === 0) {
    playerPos = { x: nx, y: ny };
    drawMaze();
    if (nx === size - 2 && ny === size - 2) {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
      setTimeout(() => alert(`Du klarade det på ${elapsed} sekunder!`), 50);
    }
  }
}

document.addEventListener("keydown", (e) => {
  if (!startTime) return;
  switch (e.key) {
    case "ArrowUp":
      movePlayer(0, -1);
      break;
    case "ArrowDown":
      movePlayer(0, 1);
      break;
    case "ArrowLeft":
      movePlayer(-1, 0);
      break;
    case "ArrowRight":
      movePlayer(1, 0);
      break;
  }
});

function startGame() {
  playerPos = { x: 1, y: 1 };
  generateMaze();
  drawMaze();
  startTime = Date.now();
}
