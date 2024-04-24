const tokenDropSound = new Audio("token-drop.wav");
const gameWinSound = new Audio("winner.wav");

const PLAYER1 = 1;
const PLAYER2 = 2;

const GAME_ON = "on";
const GAME_TIE = "tie";
const GAME_WIN = "win";

let board;
let gameStatus;
let currentPlayer;

resetGame();

// Get the reset button and add event listeners to all cells
document.getElementById("reset-button").addEventListener("click", resetGame);
let cells = document.querySelectorAll(".cell");
cells.forEach((cell) => {
  cell.addEventListener("click", handleClick);
  cell.addEventListener("mouseover", handleMouseOver);
  cell.addEventListener("mouseout", handleMouseOut);
});

// Handle click events
function handleClick(event) {
  if (gameStatus !== GAME_ON) {
    return;
  }

  let id = parseInt(event.target.id);
  let col = id % 3;
  let row = Math.floor(id / 3);

  if (board[row][col] !== 0) {
    return;
  }

  board[row][col] = currentPlayer;

  let cell = document.getElementById(row * 3 + col);
  if (currentPlayer === PLAYER1) {
    tokenDropSound.play();
    cell.classList.add("player-1");
    cell.textContent = "X";
  } else {
    tokenDropSound.play();
    cell.classList.add("player-2");
    cell.textContent = "O";
  }

  checkTie();
  let winningLine = checkWin(currentPlayer);
  if (winningLine) {
    crossWinningCells(winningLine);
  }

  if (gameStatus === GAME_ON) {
    switchPlayer();
  }
}

// Function to check for win
function checkWin(player) {
  const directions = [
    [
      [0, -1],
      [0, 1],
    ], //horizontal
    [
      [-1, 0],
      [1, 0],
    ], //vertical
    [
      [-1, -1],
      [1, 1],
    ], //diagonal from top-left to bottom-right
    [
      [-1, 1],
      [1, -1],
    ], //diagonal from top-right to bottom-left
  ];
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (board[row][col] !== player) {
        continue;
      }

      for (let direction of directions) {
        let [dr1, dc1] = direction[0];
        let [dr2, dc2] = direction[1];

        if (
          isValidCell(row + dr1, col + dc1) &&
          isValidCell(row + dr2, col + dc2) &&
          board[row + dr1][col + dc1] === player &&
          board[row + dr2][col + dc2] === player
        ) {
          gameStatus = GAME_WIN;
          document.getElementById("reset-button").style.visibility = "visible";
          gameWinSound.play();
          console.log(`Player ${player} wins!`);
          return [
            [row, col],
            [row + dr1, col + dc1],
            [row + dr2, col + dc2],
          ];
        }
      }
    }
  }
  return false;
}

// Function to check for tie
function checkTie() {
  for (let row of board) {
    for (let cell of row) {
      if (cell === 0) {
        return false;
      }
    }
  }
  gameStatus = GAME_TIE;
  document.getElementById("reset-button").style.visibility = "visible";
  console.log("It's a tie!");
  return true;
}

// Function to switch to next player
function switchPlayer() {
  currentPlayer = currentPlayer === PLAYER1 ? PLAYER2 : PLAYER1;
  updateStatusBar();
}

// Function to check if a cell is valid
function isValidCell(row, col) {
  return row >= 0 && row < 3 && col >= 0 && col < 3;
}

// Function to handle mouseover events
function handleMouseOver(event) {
  let id = parseInt(event.target.id);
  let col = id % 3;
  let row = Math.floor(id / 3);

  if (board[row][col] === 0) {
    event.target.textContent = currentPlayer === PLAYER1 ? "X" : "O";
  }
}

// Function to handle mouseout events
function handleMouseOut(event) {
  let id = parseInt(event.target.id);
  let col = id % 3;
  let row = Math.floor(id / 3);

  if (board[row][col] === 0) {
    event.target.textContent = "";
  }
}

// Function to cross through the winning cells
function crossWinningCells(winningLine) {
  for (let [row, col] of winningLine) {
    let cell = document.getElementById(row * 3 + col);
    cell.classList.add("winning-cell");
  }
}

// Function to reset the game
function resetGame() {
  gameStatus = GAME_ON;
  currentPlayer = PLAYER1;
  board = Array(3)
    .fill()
    .map(() => Array(3).fill(0));

  document.getElementById("reset-button").style.visibility = "hidden";

  let cells = document.querySelectorAll(".cell");
  cells.forEach((cell) => {
    cell.className = "cell";
    cell.textContent = "";
  });
  updateStatusBar();
}

// Function to update the status bar
function updateStatusBar() {
  document.getElementById("player-1-status").classList.remove("current-player");
  document.getElementById("player-2-status").classList.remove("current-player");
  document
    .getElementById(`player-${currentPlayer}-status`)
    .classList.add("current-player");
}
