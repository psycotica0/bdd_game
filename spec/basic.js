requirejs = require("requirejs");

requirejs.config({
  nodeRequire: require,
  baseUrl: "./"
})

var BasicCell = requirejs("cells/basic")
describe("Basic Cell", function() {
  it("Should fail in all four directions", function() {
    var cell = new BasicCell();
    expect(cell.pushLeft(7)).toBeUndefined();
    expect(cell.pushRight(7)).toBeUndefined();
    expect(cell.pushTop(7)).toBeUndefined();
    expect(cell.pushBottom(7)).toBeUndefined();
  });
});
