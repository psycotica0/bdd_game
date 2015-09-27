requirejs = require("requirejs");

requirejs.config({
  nodeRequire: require,
  baseUrl: "js",
  paths: {
    rx: "../node_modules/rx/dist/rx.lite"
  }
})

var TestElement = requirejs("testElement");
var Signals = requirejs("signals");
var Rx = requirejs("rx");

Signals.update = new Rx.Subject();
Signals.updateDone = new Rx.Subject();

describe("Test Element", function() {
  it("should push to next when it has something", function(done) {
    var e = new TestElement("", "a");
    var p = createSpyObj("dummyNext", ["push"]);
    e.next = p
    Signals.updateDone.subscribe(done);
    Signals.update.onNext();
    expect(p.push).toHaveBeenCalledWith("a", e);
  });

  it("should not push when empty", function(done) {
    var e = new TestElement("", false);
    var p = createSpyObj("dummyNext", ["push"]);
    e.next = p
    Signals.updateDone.subscribe(done);
    Signals.update.onNext();
    expect(p.push).not.toHaveBeenCalled();
  });
});
