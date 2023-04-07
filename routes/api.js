"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route("/api/check").post((req, res) => {
    let { puzzle, coordinate, value } = req.body;

    if (!puzzle || !coordinate || !value) {
      return res.status(400).json({ error: "Required field(s) missing" });
    }
    value = parseInt(value);
    let result = solver.validate(puzzle);

    if (result === true) {
      if (value < 1 || value > 9 || isNaN(value)) {
        return res.status(400).json({ error: "Invalid value" });
      }

      if (!solver.validateCordinate(coordinate)) {
        return res.status(400).json({ error: "Invalid coordinate" });
      }

      let result = solver.checkAllPlacement(puzzle, coordinate, value);

      return res.json(result);
    } else {
      return res.status(400).json({ error: result });
    }
  });

  app.route("/api/solve").post((req, res) => {
    let { puzzle } = req.body;
    if (!puzzle) {
      return res.status(400).json({ error: "Required field missing" });
    }
    let validateResult = solver.validate(puzzle);
    if (validateResult === true) {
      let result = solver.solve(puzzle);
      if (result === false) {
        return res.json({ error: "Puzzle cannot be solved" });
      } else {
        return res.json({ solution: result });
      }
    } else {
      return res.json({ error: validateResult });
    }
  });
};
