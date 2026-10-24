"use strict";

const samplePuzzle = [
  [5, 3, 0, 0, 7, 0, 0, 0, 0],
  [6, 0, 0, 1, 9, 5, 0, 0, 0],
  [0, 9, 8, 0, 0, 0, 0, 6, 0],
  [8, 0, 0, 0, 6, 0, 0, 0, 3],
  [4, 0, 0, 8, 0, 3, 0, 0, 1],
  [7, 0, 0, 0, 2, 0, 0, 0, 6],
  [0, 6, 0, 0, 0, 0, 2, 8, 0],
  [0, 0, 0, 4, 1, 9, 0, 0, 5],
  [0, 0, 0, 0, 8, 0, 0, 7, 9]
];

const boardElement = document.querySelector("#board");
const messageElement = document.querySelector("#message");
const solveButton = document.querySelector("#solve-button");
const resetButton = document.querySelector("#reset-button");
const cells = [];

function setMessage(text, state = "") {
  messageElement.textContent = text;

  if (state) {
    messageElement.dataset.state = state;
  } else {
    delete messageElement.dataset.state;
  }
}

function createBoard() {
  for (let row = 0; row < 9; row += 1) {
    cells[row] = [];

    for (let col = 0; col < 9; col += 1) {
      const input = document.createElement("input");

      input.className = "cell";
      input.type = "text";
      input.inputMode = "numeric";
      input.maxLength = 1;
      input.autocomplete = "off";
      input.setAttribute("aria-label", `Row ${row + 1}, column ${col + 1}`);
      input.addEventListener("input", handleCellInput);

      boardElement.append(input);
      cells[row][col] = input;
    }
  }
}

function handleCellInput(event) {
  const cell = event.currentTarget;
  cell.value = cell.value.replace(/[^1-9]/g, "").slice(-1);
  cell.classList.remove("invalid", "solved");
  setMessage("Puzzle updated. Select Solve puzzle when you're ready.");
}

function loadSample() {
  for (let row = 0; row < 9; row += 1) {
    for (let col = 0; col < 9; col += 1) {
      const cell = cells[row][col];
      const value = samplePuzzle[row][col];

      cell.value = value === 0 ? "" : String(value);
      cell.readOnly = value !== 0;
      cell.classList.toggle("given", value !== 0);
      cell.classList.remove("invalid", "solved");
    }
  }

  setMessage("The sample puzzle is ready. You can edit any empty cell.");
}

function readBoard() {
  return cells.map((row) =>
    row.map((cell) => cell.value === "" ? 0 : Number(cell.value))
  );
}

function findEmpty(board) {
  for (let row = 0; row < 9; row += 1) {
    for (let col = 0; col < 9; col += 1) {
      if (board[row][col] === 0) {
        return [row, col];
      }
    }
  }

  return null;
}

function isValid(board, row, col, number) {
  for (let index = 0; index < 9; index += 1) {
    if (board[row][index] === number || board[index][col] === number) {
      return false;
    }
  }

  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;

  for (let r = startRow; r < startRow + 3; r += 1) {
    for (let c = startCol; c < startCol + 3; c += 1) {
      if (board[r][c] === number) {
        return false;
      }
    }
  }

  return true;
}

function findConflicts(board) {
  const conflicts = new Set();

  function markGroup(positions) {
    const seen = new Map();

    for (const [row, col] of positions) {
      const value = board[row][col];
      if (!value) continue;

      if (seen.has(value)) {
        conflicts.add(`${row},${col}`);

        for (const [oldRow, oldCol] of seen.get(value)) {
          conflicts.add(`${oldRow},${oldCol}`);
        }

        seen.get(value).push([row, col]);
      } else {
        seen.set(value, [[row, col]]);
      }
    }
  }

  for (let index = 0; index < 9; index += 1) {
    markGroup(Array.from({ length: 9 }, (_, col) => [index, col]));
    markGroup(Array.from({ length: 9 }, (_, row) => [row, index]));
  }

  for (let boxRow = 0; boxRow < 3; boxRow += 1) {
    for (let boxCol = 0; boxCol < 3; boxCol += 1) {
      const positions = [];

      for (let row = boxRow * 3; row < boxRow * 3 + 3; row += 1) {
        for (let col = boxCol * 3; col < boxCol * 3 + 3; col += 1) {
          positions.push([row, col]);
        }
      }

      markGroup(positions);
    }
  }

  return conflicts;
}

function solveSudoku(board) {
  const empty = findEmpty(board);

  if (!empty) {
    return true;
  }

  const [row, col] = empty;

  for (let number = 1; number <= 9; number += 1) {
    if (isValid(board, row, col, number)) {
      board[row][col] = number;

      if (solveSudoku(board)) {
        return true;
      }

      board[row][col] = 0;
    }
  }

  return false;
}

function solve() {
  const board = readBoard();
  const conflicts = findConflicts(board);

  for (const cell of boardElement.querySelectorAll(".cell")) {
    cell.classList.remove("invalid", "solved");
  }

  if (conflicts.size > 0) {
    for (const key of conflicts) {
      const [row, col] = key.split(",").map(Number);
      cells[row][col].classList.add("invalid");
    }

    setMessage(
      "Some entries conflict in a row, column, or 3 × 3 box. Correct the highlighted cells.",
      "error"
    );
    return;
  }

  const original = board.map((row) => row.slice());

  if (!solveSudoku(board)) {
    setMessage("No solution exists for this puzzle. Check the numbers and try again.", "error");
    return;
  }

  for (let row = 0; row < 9; row += 1) {
    for (let col = 0; col < 9; col += 1) {
      if (original[row][col] === 0) {
        cells[row][col].value = String(board[row][col]);
        cells[row][col].classList.add("solved");
      }
    }
  }

  setMessage("Puzzle solved! Blue numbers were filled in by the solver.", "success");
}

solveButton.addEventListener("click", solve);
resetButton.addEventListener("click", loadSample);

createBoard();
loadSample();
