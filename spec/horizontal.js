requirejs = require("requirejs");

requirejs.config({
  nodeRequire: require,
  baseUrl: "./"
})

var HorizontalCell = requirejs("cells/horizontal");
var _ = requirejs("lodash");

describe("Horizontal Cell", function() {
  it("should pass things horizontally", function() {
    var leftStub = new HorizontalCell();
    spyOn(leftStub, "pushRight").andReturn(true);

    var rightStub = new HorizontalCell();
    spyOn(rightStub, "pushLeft").andReturn(true);

    var cell = new HorizontalCell();
    var item = {};

    leftStub.connectRight(cell).connectRight(rightStub);

    expect(cell.pushLeft(item)).toBe(true);
    expect(rightStub.pushLeft).toHaveBeenCalledWith(item);

    expect(cell.pushRight(item)).toBe(true);
    expect(leftStub.pushRight).toHaveBeenCalledWith(item);
  });

  it("should chain", function() {
    var head = new HorizontalCell();
    var chain = head;

    _.times(20, function() {
      chain = chain.connectRight(new HorizontalCell());
    })

    var item = {};
    spyOn(chain, "pushLeft").andReturn(true);
    expect(head.pushLeft(item)).toBe(true);
    expect(chain.pushLeft).toHaveBeenCalledWith(item);
  });

  it("should only work horizontally", function() {
    var top = new HorizontalCell();
    spyOn(top, "pushBottom").andReturn(true);

    var cell = new HorizontalCell();
    cell.connectTop(top);

    var item = {}
    expect(cell.pushBottom(item)).toBeUndefined();
    expect(top.pushBottom).not.toHaveBeenCalled();
  });
});
