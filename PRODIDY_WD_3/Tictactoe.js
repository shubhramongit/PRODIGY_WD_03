// ── Game State ──
let board        = Array(9).fill(null); // 3x3 board as flat array, null = empty
let currentPlayer = 'X';               // 'X' always goes first
let gameOver     = false;
let scores       = { X: 0, O: 0, draws: 0 };

// ── Winning Combinations ──
// All possible rows, columns, and diagonals
const WIN_COMBOS = [
  [0, 1, 2], // top row
  [3, 4, 5], // middle row
  [6, 7, 8], // bottom row
  [0, 3, 6], // left column
  [1, 4, 7], // middle column
  [2, 5, 8], // right column
  [0, 4, 8], // diagonal top-left to bottom-right
  [2, 4, 6], // diagonal top-right to bottom-left
];

// ── DOM Elements ──
const cells         = document.querySelectorAll('.cell');
const boardEl       = document.getElementById('board');
const statusEl      = document.getElementById('status');
const restartBtn    = document.getElementById('restartBtn');
const resetScoreBtn = document.getElementById('resetScoreBtn');
const xScoreEl      = document.getElementById('xScore');
const oScoreEl      = document.getElementById('oScore');
const drawScoreEl   = document.getElementById('drawScore');
const scoreX        = document.getElementById('scoreX');
const scoreO        = document.getElementById('scoreO');

// ── Cell Click Handler ──
cells.forEach(function (cell) {
  cell.addEventListener('click', function () {
    const index = parseInt(cell.getAttribute('data-index'));

    // Ignore click if cell is taken or game is over
    if (board[index] !== null || gameOver) return;

    // Place the current player's mark
    makeMove(index);
  });
});

// ── Make Move ──
function makeMove(index) {
  board[index] = currentPlayer;

  // Update cell in the DOM
  const cell = cells[index];
  cell.textContent = currentPlayer;
  cell.classList.add(currentPlayer.toLowerCase(), 'taken');

  // Check for win or draw
  const winCombo = getWinner();

  if (winCombo) {
    handleWin(winCombo);
  } else if (isDraw()) {
    handleDraw();
  } else {
    // Switch player and continue
    switchPlayer();
  }
}

// ── Check Winner ──
// Returns the winning combination array if found, otherwise null.
function getWinner() {
  for (let combo of WIN_COMBOS) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return combo;
    }
  }
  return null;
}

// ── Check Draw ──
// Draw when all cells are filled and there is no winner.
function isDraw() {
  return board.every(function (cell) { return cell !== null; });
}

// ── Handle Win ──
function handleWin(winCombo) {
  gameOver = true;

  // Highlight winning cells
  winCombo.forEach(function (index) {
    cells[index].classList.add('win');
  });

  // Update status
  statusEl.textContent = '';
  statusEl.className = 'status winner';
  const mark = document.createElement('span');
  mark.className = currentPlayer.toLowerCase();
  mark.textContent = currentPlayer;
  statusEl.appendChild(document.createTextNode('Player '));
  statusEl.appendChild(mark);
  statusEl.appendChild(document.createTextNode(' wins! 🎉'));

  // Update score
  scores[currentPlayer]++;
  updateScoreDisplay();

  // Disable board
  boardEl.classList.add('disabled');
}

// ── Handle Draw ──
function handleDraw() {
  gameOver = true;
  statusEl.textContent = "It's a draw!";
  statusEl.className = 'status draw';
  scores.draws++;
  updateScoreDisplay();
  boardEl.classList.add('disabled');
}

// ── Switch Player ──
function switchPlayer() {
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  updateStatus();
  updateActiveScore();
}

// ── Update Status Text ──
function updateStatus() {
  statusEl.className = 'status';
  statusEl.textContent = '';
  statusEl.appendChild(document.createTextNode('Player '));
  const mark = document.createElement('span');
  mark.className = currentPlayer.toLowerCase();
  mark.textContent = currentPlayer;
  statusEl.appendChild(mark);
  statusEl.appendChild(document.createTextNode("'s turn"));
}

// ── Highlight Active Player Score ──
function updateActiveScore() {
  scoreX.classList.remove('active-x');
  scoreO.classList.remove('active-o');
  if (currentPlayer === 'X') {
    scoreX.classList.add('active-x');
  } else {
    scoreO.classList.add('active-o');
  }
}

// ── Update Score Display ──
function updateScoreDisplay() {
  xScoreEl.textContent    = scores.X;
  oScoreEl.textContent    = scores.O;
  drawScoreEl.textContent = scores.draws;
}

// ── Restart Game ──
// Resets the board only; keeps scores intact.
restartBtn.addEventListener('click', function () {
  board         = Array(9).fill(null);
  currentPlayer = 'X';
  gameOver      = false;

  // Clear all cells
  cells.forEach(function (cell) {
    cell.textContent = '';
    cell.className   = 'cell';
  });

  boardEl.classList.remove('disabled');
  updateStatus();
  updateActiveScore();
});

// ── Reset Score ──
// Resets scores and restarts the game.
resetScoreBtn.addEventListener('click', function () {
  scores = { X: 0, O: 0, draws: 0 };
  updateScoreDisplay();
  restartBtn.click(); // reuse restart logic
});

// ── Init ──
updateActiveScore();