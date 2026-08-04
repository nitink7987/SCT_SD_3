Sudoku Solver

A Python-based Sudoku Solver that automatically solves incomplete Sudoku puzzles using the **Backtracking Algorithm**. The program takes a 9×9 Sudoku grid as input, fills in the missing numbers while following Sudoku rules, and displays the completed solution.

This project was created for **SkillCraft Technology — Software Development Internship, Task 03**.

Features

* Solves any valid 9×9 Sudoku puzzle automatically
* Uses the Backtracking Algorithm for efficient solving
* Validates each number before placing it in the grid
* Ensures all Sudoku rules are followed
* Detects whether a valid solution exists
* Displays the completed Sudoku grid
* Simple and easy-to-understand Python implementation

 Technologies Used

* Python
* Backtracking Algorithm

 How to Run

1. Clone this repository.
2. Open the project folder in VS Code.
3. Run the following command in the terminal:

```bash
```

How It Works

1. Enter or define an unsolved Sudoku puzzle using `0` for empty cells.
2. Run the program.
3. The solver searches for a valid solution using backtracking.
4. If a solution exists, the completed Sudoku grid is displayed.
5. If the puzzle is invalid or unsolvable, an appropriate message is shown.

Project Structure

```text
SCT_SD_3/
├── sudoku_solver.py
├── README.md
└── .gitignore
```
