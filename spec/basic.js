requirejs = require("requirejs");

requirejs.config({
  nodeRequire: require,
  baseUrl: "./"
})

var BasicCell = requirejs("cells/basic")
describe("Basic Cell", function() {
  it("should fail in all four directions", function() {
    var cell = new BasicCell();
    expect(cell.pushLeft(7)).toBeUndefined();
    expect(cell.pushRight(7)).toBeUndefined();
    expect(cell.pushTop(7)).toBeUndefined();
    expect(cell.pushBottom(7)).toBeUndefined();
  });

  it("should connect in all directions", function() {
    var tlCell = new BasicCell();
    var trCell = new BasicCell();
    var blCell = new BasicCell();
    var brCell = new BasicCell();

    tlCell.
      connectRight(trCell).
      connectBottom(brCell).
      connectLeft(blCell).
      connectTop(tlCell);

    expect(tlCell.right).toBe(trCell);
    expect(trCell.left).toBe(tlCell);

    expect(tlCell.top).toBeUndefined();

    // Go with the connection to test forward
    expect(tlCell.right.bottom.left.top).toBe(tlCell);

    // Go CounterClockwise to test the backwards
    expect(tlCell.bottom.right.top.left).toBe(tlCell);
  });
});
