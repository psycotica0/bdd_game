var requirejs = require("../config");
var buildSignalMock = require("../signal_mock");

var EmptyCell = requirejs("cells/empty");

describe("Empty Cell", function() {
  it("should run through the basic flow", function(done) {
    var signalMock = buildSignalMock();
    var cell = new EmptyCell(signalMock);
    signalMock.updateDone.subscribe(signalMock.resolve.onNext.bind(signalMock.resolve));
    signalMock.resolveDone.subscribe(done);

    signalMock.update.onNext();
  });

  it("should fail when pushed anything", function(done) {
    var signalMock = buildSignalMock();
    var cell = new EmptyCell(signalMock);
    var item = {};
    var failures = 0;
    signalMock.error.subscribe(function() {
      if (++failures == 4) {
        done();
      }
    });

    cell.pushTop(item, undefined);
    signalMock.resolve.onNext();
    signalMock.commit.onNext();

    cell.pushBottom(item, undefined);
    signalMock.resolve.onNext();
    signalMock.commit.onNext();

    cell.pushLeft(item, undefined);
    signalMock.resolve.onNext();
    signalMock.commit.onNext();

    cell.pushRight(item, undefined);
    signalMock.resolve.onNext();
    signalMock.commit.onNext();

  });
});
