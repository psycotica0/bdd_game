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

  it("should handle push while full", function() {
    var cell = new HorizontalCell(signalMock);
    var mockLeft = createSpyObj("mockLeft", ["pushRight"]);
    cell.left = mockLeft;
    var item1 = {};
    var item2 = {};

    // Setup Pipeline
    signalMock.updateDone.subscribe(signalMock.resolve.onNext.bind(signalMock.resolve));
    signalMock.resolveDone.subscribe(signalMock.commit.onNext.bind(signalMock.commit));
    signalMock.error.subscribe(function() {
      expect("Error not to be signalled").toBe("");
    });

    // Load the first one
    cell.pushRight(item1, undefined);
    signalMock.update.onNext();
    expect(mockLeft.pushRight.calls.length).toBe(0);

    // Load the second while getting the first
    cell.pushRight(item2, undefined);
    signalMock.update.onNext();
    expect(mockLeft.pushRight.calls.length).toBe(1);
    expect(mockLeft.pushRight).toHaveBeenCalledWith(item1, cell);

    // Get the last one
    signalMock.update.onNext();
    expect(mockLeft.pushRight.calls.length).toBe(2);
    expect(mockLeft.pushRight).toHaveBeenCalledWith(item2, cell);
  });

  it("should push back upstream when full", function() {
    var cell = new HorizontalCell(signalMock);
    var item1 = {};
    var item2 = {};
    var mockRight = createSpyObj("mockRight", ["pushLeft"]);
    var mockLeft = createSpyObj("mockLeft", ["rollbackRight"]);
    cell.right = mockRight;
    cell.left = mockLeft;

    signalMock.error.subscribe(function() {
      expect("Error not to be signalled").toBe("");
    });

    // Load it
    signalMock.update.onNext();
    cell.pushLeft(item1, mockLeft);
    signalMock.resolve.onNext();
    signalMock.commit.onNext();

    // Fail it
    cell.pushLeft(item2, mockLeft);
    signalMock.update.onNext();
    signalMock.resolve.onNext();
    cell.rollbackRight();
    signalMock.commit.onNext();

    expect(mockLeft.rollbackRight).toHaveBeenCalled();

    // Pass and make sure it still comes out
    signalMock.update.onNext();
    cell.pushLeft(item2, mockLeft);
    signalMock.resolve.onNext();
    signalMock.commit.onNext();

    expect(mockRight.pushLeft).toHaveBeenCalledWith(item1, cell);
    expect(mockRight.pushLeft.calls.length).toBe(2);

    // Make sure the second one made it
    signalMock.update.onNext();
    signalMock.resolve.onNext();
    signalMock.commit.onNext();

    expect(mockRight.pushLeft.calls.length).toBe(3);
    expect(mockRight.pushLeft).toHaveBeenCalledWith(item2, cell);
  });

  it("should handle push from the left then the right", function() {
    var cell = new HorizontalCell(signalMock);
    var mockLeft = createSpyObj("mockLeft", ["pushRight"]);
    var mockRight = createSpyObj("mockRight", ["pushLeft"]);
    cell.left = mockLeft;
    cell.right = mockRight;
    var item1 = {};
    var item2 = {};

    // Setup Pipeline
    signalMock.updateDone.subscribe(signalMock.resolve.onNext.bind(signalMock.resolve));
    signalMock.resolveDone.subscribe(signalMock.commit.onNext.bind(signalMock.commit));
    signalMock.error.subscribe(function() {
      expect("Error not to be signalled").toBe("");
    });

    cell.pushRight(item1, mockRight);
    signalMock.update.onNext();
    expect(mockLeft.pushRight.calls.length).toBe(0);
    expect(mockRight.pushLeft.calls.length).toBe(0);

    signalMock.update.onNext();
    expect(mockLeft.pushRight.calls.length).toBe(1);
    expect(mockRight.pushLeft.calls.length).toBe(0);
    expect(mockLeft.pushRight).toHaveBeenCalledWith(item1, cell);

    cell.pushLeft(item2, mockLeft);
    signalMock.update.onNext();
    signalMock.update.onNext();
    expect(mockLeft.pushRight.calls.length).toBe(1);
    expect(mockRight.pushLeft.calls.length).toBe(1);
    expect(mockRight.pushLeft).toHaveBeenCalledWith(item2, cell);
  });

  it("should error if something comes in from both sides", function() {
    var cell = new HorizontalCell(signalMock);
    var item1 = {};
    var item2 = {};

    var called = false;
    signalMock.error.subscribe(function() {
      called = true;
    });
    signalMock.updateDone.subscribe(signalMock.resolve.onNext.bind(signalMock.resolve));

    cell.pushLeft(item1, undefined);
    cell.pushRight(item2, undefined);

    signalMock.update.onNext();
    expect(called).toBe(true);
  });

  it("should error if things collide", function() {
    var cell = new HorizontalCell(signalMock);
    var mockRight = createSpyObj("mockRight", ["pushLeft"]);
    cell.right = mockRight;
    var item1 = {};
    var item2 = {};

    var called = false;
    signalMock.error.subscribe(function() {
      called = true;
    });
    signalMock.updateDone.subscribe(signalMock.resolve.onNext.bind(signalMock.resolve));
    signalMock.resolveDone.subscribe(signalMock.commit.onNext.bind(signalMock.commit));

    cell.pushLeft(item1, undefined);
    signalMock.update.onNext();

    cell.pushRight(item2, undefined);
    signalMock.update.onNext();

    expect(called).toBe(true);
  });
});
