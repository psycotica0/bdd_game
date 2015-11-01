var requirejs = require("../config");
var buildSignalMock = require("../signal_mock");
var _ = require("lodash");

var Exclusive4 = requirejs("cells/exclusive4");
var Dir = requirejs("dir");

describe("Exclusive4 Cell", function() {
  var signalMock;

  beforeEach(function() {
    signalMock = buildSignalMock();
  });

  it("should push things left to right", function() {
    var cell = new Exclusive4(signalMock);
    var item = {};
    var mockRight = createSpyObj("mockRight", ["push"])
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
    expect(mockRight.push).not.toHaveBeenCalled();

    // Second update should pass it to the next
    signalMock.update.onNext();
    expect(mockRight.push).toHaveBeenCalledWith(Dir.left, item, cell);

    // Third update should do nothing
    signalMock.update.onNext();
    expect(mockRight.push.calls.length).toBe(1);
  });

  it("should push things top to bottom", function() {
    var cell = new Exclusive4(signalMock);
    var item = {};
    var mockBottom = createSpyObj("mockBottom", ["push"])
    cell.bottom = mockBottom;

    // Setup Pipeline
    signalMock.updateDone.subscribe(signalMock.resolve.onNext.bind(signalMock.resolve));
    signalMock.resolveDone.subscribe(signalMock.commit.onNext.bind(signalMock.commit));
    signalMock.error.subscribe(function() {
      expect("Error not to be signalled").toBe("");
    });

    cell.pushTop(item, undefined);

    // First update should move it into place
    signalMock.update.onNext();
    expect(mockBottom.push).not.toHaveBeenCalled();

    // Second update should pass it to the next
    signalMock.update.onNext();
    expect(mockBottom.push).toHaveBeenCalledWith(Dir.top, item, cell);

    // Third update should do nothing
    signalMock.update.onNext();
    expect(mockBottom.push.calls.length).toBe(1);
  });

  xit("should push back on left when pushed on the right");
  xit("should push back on top when pushed on the bottom");

  it("should give precedence to horizontal movement", function() {
    var cell = new Exclusive4(signalMock);
    var item1 = {};
    var item2 = {};
    var mockTop = createSpyObj("mockTop", ["rollback"]);
    var mockLeft = createSpyObj("mockLeft", ["rollback"]);
    var mockRight = createSpyObj("mockRight", ["push"]);
    var mockBottom = createSpyObj("mockBottom", ["push"]);
    cell.top = mockTop;
    cell.left = mockLeft;
    cell.right = mockRight;
    cell.bottom = mockBottom;

    // Setup Pipeline
    signalMock.updateDone.subscribe(signalMock.resolve.onNext.bind(signalMock.resolve));
    signalMock.resolveDone.subscribe(signalMock.commit.onNext.bind(signalMock.commit));
    signalMock.error.subscribe(function() {
      expect("Error not to be signalled").toBe("");
    });

    cell.pushTop(item1, mockTop);
    cell.pushLeft(item2, mockLeft);

    _.times(4, function(phase) {
      // Run the pump
      signalMock.update.onNext();
      switch(phase) {
        case 0: // Should take the left, push on the top
          expect(mockTop.rollback).toHaveBeenCalled();
          expect(mockLeft.rollback).not.toHaveBeenCalled();
          expect(mockRight.push).not.toHaveBeenCalled();
          expect(mockBottom.push).not.toHaveBeenCalled();
          // Push it again
          cell.pushTop(item2, mockTop);
          break;
        case 1: // Should push left to right, take the top
          expect(mockTop.rollback.calls.length).toBe(1);
          expect(mockLeft.rollback).not.toHaveBeenCalled();
          expect(mockRight.push).toHaveBeenCalledWith(Dir.left, item1, cell);
          expect(mockBottom.push).not.toHaveBeenCalled();
          break;
        case 2: // Should push top to bottom
          expect(mockTop.rollback.calls.length).toBe(1);
          expect(mockLeft.rollback).not.toHaveBeenCalled();
          expect(mockRight.push.calls.length).toBe(1);
          expect(mockBottom.push).toHaveBeenCalledWith(Dir.top, item2, cell);
          break;
        case 3: // Should do nothing
          expect(mockTop.rollback.calls.length).toBe(1);
          expect(mockLeft.rollback).not.toHaveBeenCalled();
          expect(mockRight.push.calls.length).toBe(1);
          expect(mockBottom.push.calls.length).toBe(1);
          break;
      }
    });
  });
});
