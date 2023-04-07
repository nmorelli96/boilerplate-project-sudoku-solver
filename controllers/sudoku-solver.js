class SudokuSolver {
  validate(puzzleString) {
    if (puzzleString.length != 81) {
      return "Expected puzzle to be 81 characters long";
    }
    // convert string into a array with elements
    let chars = [...puzzleString];
    //check for invalid chars
    for (let i = 0; i < 81; i++) {
      if (isNaN(parseInt(chars[i])) && chars[i] !== ".") {
        return "Invalid characters in puzzle";
      }
    }
    //proceed to solving
    for (let i = 0; i < 81; i++) {
      if (puzzleString.charAt(i) === ".") {
        continue;
      }
      let row = Math.floor(i / 9);
      let column = i % 9;
      let value = puzzleString.charAt(i);
      let rowPlacement = this.checkRowPlacement(
        puzzleString,
        row,
        column,
        value
      );
      let colPlacement = this.checkColPlacement(
        puzzleString,
        row,
        column,
        value
      );
      let regionPlacement = this.checkRegionPlacement(
        puzzleString,
        row,
        column,
        value
      );
      /*console.log(
        `row: ${rowPlacement}, col: ${colPlacement}, reg: ${regionPlacement}`
      );*/
      if (rowPlacement > 1 || !colPlacement > 1 || !regionPlacement > 1) {
        return "Puzzle cannot be solved";
      }
    }
    return true;
  }

  validateCordinate(coordinate) {
    let coordinatePoints = [...coordinate];
    if (coordinate.length !== 2) {
      return false;
    }
    let rowCoordinates = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
    if (!rowCoordinates.includes(coordinatePoints[0])) {
      return false;
    }
    let colCoordinate = parseInt(coordinatePoints[1]);
    if (isNaN(colCoordinate) || colCoordinate < 1 || colCoordinate > 9) {
      return false;
    }
    return true;
  }

  convertCoordinate(coordinate) {
    let coordinatePoints = [...coordinate];
    let rowCoordinates = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
    let row = rowCoordinates.indexOf(coordinatePoints[0]);
    let col = parseInt(coordinatePoints[1]) - 1;
    return { row, col };
  }

  checkAllPlacement(puzzle, coordinate, value) {
    let getIndex = (x, y) => {
      return 9 * x + y;
    };
    let { row, col } = this.convertCoordinate(coordinate);
    let rowPlacement = this.checkRowPlacement(puzzle, row, col, value);
    let colPlacement = this.checkColPlacement(puzzle, row, col, value);
    let regionPlacement = this.checkRegionPlacement(puzzle, row, col, value);
    /*console.log(
      `row: ${rowPlacement}, col: ${colPlacement}, reg: ${regionPlacement}`
    );*/
    
    let coordinateIndex = getIndex(row, col);
    console.log(coordinateIndex)
    if (value == puzzle.charAt(coordinateIndex)) {
      return { valid: true };
    }

    let conflict = [];
    if (rowPlacement > 0) {
      conflict.push("row");
    }
    if (colPlacement > 0) {
      conflict.push("column");
    }
    if (regionPlacement > 0) {
      conflict.push("region");
    }
    console.log(conflict);
    if (conflict.length === 0) {
      return { valid: true };
    }
    return { valid: false, conflict };
  }

  checkRowPlacement(puzzleString, row, column, value) {
    let count = 0;
    let rowCut = row * 9 + 9;
    let rowNumbers = puzzleString.slice(row * 9, rowCut);
    let rowArr = [...rowNumbers];
    for (let i = 0; i < rowArr.length; i++) {
      if (rowArr[i] == value) {
        count += 1;
      }
    }
    return count;
  }

  checkColPlacement(puzzleString, row, column, value) {
    let count = 0;
    let chars = [...puzzleString];
    let colArr = [
      chars[column],
      chars[column + 9],
      chars[column + 18],
      chars[column + 27],
      chars[column + 36],
      chars[column + 45],
      chars[column + 54],
      chars[column + 63],
      chars[column + 72],
    ];
    for (let i = 0; i < colArr.length; i++) {
      if (colArr[i] == value) {
        count += 1;
      }
    }
    return count;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    let multiplier = 3;
    let region = "";
    let count = 0;
    let chars = [...puzzleString];
    let regionArr = [];

    let getArr = (multiplier, region) => {
      regionArr = [
        chars[multiplier * region],
        chars[multiplier * region + 1],
        chars[multiplier * region + 2],
        chars[multiplier * region + 9],
        chars[multiplier * region + 10],
        chars[multiplier * region + 11],
        chars[multiplier * region + 18],
        chars[multiplier * region + 19],
        chars[multiplier * region + 20],
      ];
    };

    let getRegion = (row, column) => {
      if (row >= 0 && row < 3) {
        if (column >= 0 && column < 3) {
          region = 0;
          getArr(multiplier, region);
        } else if (column >= 3 && column < 6) {
          region = 1;
          getArr(multiplier, region);
        } else if (column >= 6 && column <= 8) {
          region = 2;
          getArr(multiplier, region);
        }
      } else if (row >= 3 && row < 6) {
        if (column >= 0 && column < 3) {
          region = 9;
          getArr(multiplier, region);
        } else if (column >= 3 && column < 6) {
          region = 10;
          getArr(multiplier, region);
        } else if (column >= 6 && column <= 8) {
          region = 11;
          getArr(multiplier, region);
        }
      } else if (row >= 6 && row < 8) {
        if (column >= 0 && column < 3) {
          region = 18;
          getArr(multiplier, region);
        } else if (column >= 3 && column < 6) {
          region = 19;
          getArr(multiplier, region);
        } else if (column >= 6 && column <= 8) {
          region = 20;
          getArr(multiplier, region);
        }
      }
      for (let i = 0; i < regionArr.length; i++) {
        if (regionArr[i] == value) {
          count += 1;
        }
      }
      return count;
    };
    return getRegion(row, column);
  }

  solve(puzzleString) {
    const toSolveIndex = puzzleString.indexOf(".");
    if (toSolveIndex === -1) {
      // No empty cell found - the puzzle is solved!
      return puzzleString;
    }
    const row = Math.floor(toSolveIndex / 9);
    const column = toSolveIndex % 9;

    for (let i = 1; i <= 9; i++) {
      // i is number to be filled/checked.
      if (
        this.checkRowPlacement(puzzleString, row, column, i) < 1 &&
        this.checkColPlacement(puzzleString, row, column, i) < 1 &&
        this.checkRegionPlacement(puzzleString, row, column, i) < 1
      ) {
        // If placement is possible, then place it and call recursively.
        const possibleString =
          puzzleString.slice(0, toSolveIndex) +
          i +
          puzzleString.slice(toSolveIndex + 1);
        //console.log(possibleString);
        const solvedPuzzle = this.solve(possibleString);
        // If recursive solution is possible, return the solution.
        if (solvedPuzzle) {
          //console.log(`solved ${solvedPuzzle}`);
          return solvedPuzzle;
        }
      }
    }
    // No valid number found - backtrack by returning false.
    return false;
  }
}

module.exports = SudokuSolver;
