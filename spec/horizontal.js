var requirejs = require("../config");
var buildSignalMock = require("../signal_mock");

var HorizontalCell = requirejs("cells/horizontal");

describe("Horizontal Cell", function() {
  var signalMock;

  beforeEach(function() {
    signalMock = buildSignalMock();
  });

  it("should error when passed something from above", function() {
    var called = false
    var cell = new HorizontalCell(signalMock);
    signalMock.error.subscribe(function() {
      called = true
    })
    cell.pushTop({}, undefined);
    signalMock.resolve.onNext();
    expect(called).toBe(true);
  });

  it("should error when passed something from below", function() {
    var called = false
    var cell = new HorizontalCell(signalMock);
    signalMock.error.subscribe(function() {
      called = true
    })
    cell.pushBottom({}, undefined);
    signalMock.resolve.onNext();
    expect(called).toBe(true);
  });

  it("should pass things left to right", function() {
    var cell = new HorizontalCell(signalMock);
    var item = {};
    var mockRight = createSpyObj("mockRight", ["pushLeft"])
    cell.right = mockRight;

    // Setup Pipeline
    signalMock.updateDone.subscribe(signalMock.resolve.onNext.bind(signalMock.resolve));
    signalMock.resolveDone.subscribe(signalMock.commit.onNext.bind(signalMock.commit));
    signalMock.error.subscribe(function() {
      expect("Error not to be signalled").toBe("");
    });

    cell.pushLeft(item, undefined);

    // First update should move it into place
    signalMock.update.onNext();
    expect(mockRight.pushLeft).not.toHaveBeenCalled();

    // Second update should pass it to the next
    signalMock.update.onNext();
    expect(mockRight.pushLeft).toHaveBeenCalledWith(item, cell);
  });

  it("should pass things right to left", function() {
    var cell = new HorizontalCell(signalMock);
    var item = {};
    var mockLeft = createSpyObj("mockLeft", ["pushRight"])
    cell.left = mockLeft;

    // Setup Pipeline
    signalMock.updateDone.subscribe(signalMock.resolve.onNext.bind(signalMock.resolve));
    signalMock.resolveDone.subscribe(signalMock.commit.onNext.bind(signalMock.commit));
    signalMock.error.subscribe(function() {
      expect("Error not to be signalled").toBe("");
    });

    cell.pushRight(item, undefined);

    // First update should move it into place
    signalMock.update.onNext();
    expect(mockLeft.pushRight).not.toHaveBeenCalled();

    // Second update should pass it to the next
    signalMock.update.onNext();
    expect(mockLeft.pushRight).toHaveBeenCalledWith(item, cell);
  });

  it("should handle rollback properly", function() {
    var cell = new HorizontalCell(signalMock);
    var item= {};
    var mockRight = createSpyObj("mockRight", ["pushLeft"]);
    cell.right = mockRight;

    signalMock.error.subscribe(function() {
      expect("Error not to be signalled").toBe("");
    });

    // Load it
    signalMock.update.onNext();
    cell.pushLeft(item, undefined);
    signalMock.resolve.onNext();
    signalMock.commit.onNext();

    // Fail it
    signalMock.update.onNext();
    signalMock.resolve.onNext();
    cell.rollbackRight();
    signalMock.commit.onNext();

    expect(mockRight.pushLeft).toHaveBeenCalledWith(item, cell);
    expect(mockRight.pushLeft.calls.length).toBe(1);

    // Pass and make sure it still comes out
    signalMock.update.onNext();
    signalMock.resolve.onNext();
    signalMock.commit.onNext();

    expect(mockRight.pushLeft).toHaveBeenCalledWith(item, cell);
    expect(mockRight.pushLeft.calls.length).toBe(2);

    // Make sure it's gone for real
    signalMock.update.onNext();
    signalMock.resolve.onNext();
    signalMock.commit.onNext();

    expect(mockRight.pushLeft.calls.length).toBe(2);
  });

  xit("should handle push while full", function() {
  });

  xit("should push back upstream when full", function() {
  });

  xit("should error if something comes in from both sides", function() {
  });
});
