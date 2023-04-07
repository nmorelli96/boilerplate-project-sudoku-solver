const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

let validPuzzle =
  "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
let invalidPuzzle =
  "2.9..5.1.8514....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
let invalidCharsPuzzle =
  "z.9..5.1.8514....243y......1...69.83.s.....6.62.71...9......1945....4.37.4.3..6..";

suite("Functional Tests", () => {
  test("Solve a puzzle with valid puzzle string: POST request to /api/solve", function (done) {
    chai
      .request(server)
      .post("/api/solve")
      .send({
        puzzle: validPuzzle,
      })
      .end(function (err, res) {
        assert.equal(res.status, 200, "Response status should be 200");
        assert.equal(
          res.body.solution,
          "135762984946381257728459613694517832812936745357824196473298561581673429269145378"
        );
        done();
      });
  });
  test("Solve a puzzle with missing puzzle string: POST request to /api/solve", function (done) {
    chai
      .request(server)
      .post("/api/solve")
      .send({
        puzzle: "",
      })
      .end(function (err, res) {
        assert.equal(res.status, 400, "Response status should be 400");
        assert.deepEqual(res.body, { error: "Required field missing" });
        done();
      });
  });
  test("Solve a puzzle with invalid characters: POST request to /api/solve", function (done) {
    chai
      .request(server)
      .post("/api/solve")
      .send({
        puzzle: invalidCharsPuzzle,
      })
      .end(function (err, res) {
        assert.equal(res.status, 200, "Response status should be 200");
        assert.deepEqual(res.body, { error: "Invalid characters in puzzle" });
        done();
      });
  });
  test("Solve a puzzle with incorrect length: POST request to /api/solve", function (done) {
    chai
      .request(server)
      .post("/api/solve")
      .send({
        puzzle:
          "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....937.",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200, "Response status should be 200");
        assert.deepEqual(res.body, {
          error: "Expected puzzle to be 81 characters long",
        });
        done();
      });
  });
  test("Solve a puzzle that cannot be solved: POST request to /api/solve", function (done) {
    chai
      .request(server)
      .post("/api/solve")
      .send({
        puzzle: invalidPuzzle,
      })
      .end(function (err, res) {
        assert.equal(res.status, 200, "Response status should be 200");
        assert.deepEqual(res.body, { error: "Puzzle cannot be solved" });
        done();
      });
  });
  test("Check a puzzle placement with all fields: POST request to /api/check", function (done) {
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle: validPuzzle,
        coordinate: "A2",
        value: 3,
      })
      .end(function (err, res) {
        assert.equal(res.status, 200, "Response status should be 200");
        assert.property(res.body, "valid");
        assert.equal(res.body.valid, true);
        done();
      });
  });
  test("Check a puzzle placement with single placement conflict: POST request to /api/check", function (done) {
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle: validPuzzle,
        coordinate: "A2",
        value: 8,
      })
      .end(function (err, res) {
        assert.equal(res.status, 200, "Response status should be 200");
        assert.property(res.body, "conflict");
        assert.equal(res.body.valid, false);
        assert.equal(res.body.conflict.length, 1);
        done();
      });
  });
  test("Check a puzzle placement with multiple placements conflict: POST request to /api/check", function (done) {
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle: validPuzzle,
        coordinate: "B1",
        value: 3,
      })
      .end(function (err, res) {
        assert.equal(res.status, 200, "Response status should be 200");
        assert.property(res.body, "conflict");
        assert.equal(res.body.valid, false);
        assert.equal(res.body.conflict.length, 2);
        done();
      });
  });
  test("Check a puzzle placement with all placements conflict: POST request to /api/check", function (done) {
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle: validPuzzle,
        coordinate: "A1",
        value: 2,
      })
      .end(function (err, res) {
        assert.equal(res.status, 200, "Response status should be 200");
        assert.property(res.body, "conflict");
        assert.equal(res.body.valid, false);
        assert.equal(res.body.conflict.length, 3);
        done();
      });
  });
  test("Check a puzzle placement with missing required fields: POST request to /api/check", function (done) {
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle: validPuzzle,
        coordinate: "A1",
      })
      .end(function (err, res) {
        assert.equal(res.status, 400, "Response status should be 400");
        assert.property(res.body, "error");
        assert.deepEqual(res.body, { error: "Required field(s) missing" });
        done();
      });
  });
  test("Check a puzzle placement with invalid characters: POST request to /api/check", function (done) {
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle: invalidCharsPuzzle,
        coordinate: "A1",
        value: 2
      })
      .end(function (err, res) {
        assert.equal(res.status, 400, "Response status should be 400");
        assert.property(res.body, "error");
        assert.deepEqual(res.body, { error: "Invalid characters in puzzle" });
        done();
      });
  });
  test("Check a puzzle placement with incorrect length: POST request to /api/check", function (done) {
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle: "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....937.",
        coordinate: "A1",
        value: 2
      })
      .end(function (err, res) {
        assert.equal(res.status, 400, "Response status should be 400");
        assert.property(res.body, "error");
        assert.deepEqual(res.body, { error: "Expected puzzle to be 81 characters long" });
        done();
      });
  });
  test("Check a puzzle placement with invalid placement coordinate: POST request to /api/check", function (done) {
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle: validPuzzle,
        coordinate: "Y1",
        value: 2
      })
      .end(function (err, res) {
        assert.equal(res.status, 400, "Response status should be 400");
        assert.property(res.body, "error");
        assert.deepEqual(res.body, { error: "Invalid coordinate" });
        done();
      });
  });
  test("Check a puzzle placement with invalid placement value: POST request to /api/check", function (done) {
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle: validPuzzle,
        coordinate: "Y1",
        value: 12
      })
      .end(function (err, res) {
        assert.equal(res.status, 400, "Response status should be 400");
        assert.property(res.body, "error");
        assert.deepEqual(res.body, { error: "Invalid value" });
        done();
      });
  });
});
