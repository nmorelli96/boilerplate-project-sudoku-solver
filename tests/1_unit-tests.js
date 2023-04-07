const chai = require("chai");
const assert = chai.assert;

const Solver = require("../controllers/sudoku-solver.js");
let solver = new Solver();

let validPuzzle =
  "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
let invalidPuzzle =
  "2.9..5.1.8514....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
let invalidCharsPuzzle =
  "z.9..5.1.8514....243y......1...69.83.s.....6.62.71...9......1945....4.37.4.3..6..";

suite("Unit Tests", () => {
  test("Logic handles a valid puzzle string of 81 characters", function (done) {
    assert.equal(solver.validate(validPuzzle), true);
    done();
  });
  test("Logic handles a puzzle string with invalid characters (not 1-9 or .)", function (done) {
    assert.equal(
      solver.validate(invalidCharsPuzzle),
      "Invalid characters in puzzle"
    );
    done();
  });
  test("Logic handles a puzzle string that is not 81 characters in length", function (done) {
    assert.equal(
      solver.validate("1.5..2.84..63.12.7.2..5.....9..1."),
      "Expected puzzle to be 81 characters long"
    );
    done();
  });
  test("Logic handles a valid row placement", function (done) {
    assert.equal(solver.checkRowPlacement(validPuzzle, 0, 1, 3), 0);
    assert.equal(solver.checkRowPlacement(validPuzzle, 8, 8, 8), 0);
    done();
  });
  test("Logic handles a invalid row placement", function (done) {
    assert.equal(solver.checkRowPlacement(validPuzzle, 0, 1, 2), 1);
    assert.equal(solver.checkRowPlacement(validPuzzle, 8, 8, 2), 1);
    done();
  });
  test("Logic handles a valid column placement", function (done) {
    assert.equal(solver.checkColPlacement(validPuzzle, 0, 1, 3), 0);
    assert.equal(solver.checkColPlacement(validPuzzle, 8, 8, 8), 0);
    done();
  });
  test("Logic handles a invalid column placement", function (done) {
    assert.equal(solver.checkColPlacement(validPuzzle, 0, 1, 7), 1);
    assert.equal(solver.checkColPlacement(validPuzzle, 8, 8, 1), 1);
    done();
  });
  test("Logic handles a valid region (3x3 grid) placement", function (done) {
    assert.equal(solver.checkRegionPlacement(validPuzzle, 0, 1, 7), 0);
    assert.equal(solver.checkRegionPlacement(validPuzzle, 8, 8, 2), 0);
    done();
  });
  test("Logic handles a invalid region (3x3 grid) placement", function (done) {
    assert.equal(solver.checkRegionPlacement(validPuzzle, 0, 0, 1), 1);
    done();
  });
  test("Valid puzzle strings pass the solver", function (done) {
    assert.equal(
      solver.solve(
        validPuzzle),
      "135762984946381257728459613694517832812936745357824196473298561581673429269145378"
    );
    done();
  });
  test("Invalid puzzle strings fail the solver", function (done) {
    assert.equal(
      solver.solve(
        invalidPuzzle),
      false
    );
    done();
  });
  test("Solver returns the expected solution for an incomplete puzzle", function (done) {
    assert.equal(
      solver.solve(
        "1357629849463812.772845961369.51783281.936745357824..64732985615816.3429269145378"),
      "135762984946381257728459613694517832812936745357824196473298561581673429269145378"
    );
    done();
  });
});
