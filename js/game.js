requirejs([
  "rx", "signals", "controls", "palette",
  "cells/empty", "drawingCell",
  "cells/emitter_r", "cells/sinkr",
  "conf",
  "rx.custom"
  ], function(
  Rx, signals, controls, palette,
  EmptyCell, DrawingCell,
  EmitterR, SinkR,
  Conf
) {
  var svg = document.getElementById("grid");

  svg.setAttribute("width", Conf.cellSize * Conf.gridWidth);
  svg.setAttribute("height", Conf.cellSize * Conf.gridHeight);

  for (var y = 0; y < Conf.gridHeight; y++) {
    for (var x = 0; x < Conf.gridWidth; x++) {
      var cell;
      if (x == 0 && y == 5)
        cell = new EmitterR(signals, "a");
      else if (x == 0 && y == 3)
        cell = new EmitterR(signals, "b");
      else if (x == 0 && y == 2)
        cell = new SinkR(signals, "a", "a");
      else if (x == 0 && y == 8)
        cell = new SinkR(signals, "b", "b");
      else
        cell = new EmptyCell(signals);

      new DrawingCell(x, y, svg, cell, signals, cell instanceof EmptyCell);
    }
  }

  {
    var errorSpan = document.getElementById("errors");
    var errorTally;
    signals.reset.subscribe(function() {
      errorSpan.textContent = "";
    });
    signals.reset.subscribe(function() {
      if (errorTally)
        errorTally.dispose();
      errorTally = signals.error.tally().succ().subscribe(function(errorCount) {
        errorSpan.textContent = errorCount;
      });
    });
  }

  function simpleTask(id, item) {
    var task = document.getElementById(id);
    var successSpan = task.querySelector(".progress");
    var successTally;
    signals.reset.subscribe(function() {
      successSpan.textContent = "0";
    });
    signals.reset.subscribe(function() {
      task.setAttribute("class", "");
      if (successTally)
        successTally.dispose();
      successTally = signals.received
        .filter(_.partial(_.isEqual, item))
        .tally().succ().subscribe(function(successCount) {
        successSpan.textContent = successCount;
        if (successCount == 10) {
          task.setAttribute("class", "complete");
        }
      });
    });
  }

  simpleTask("task1", "a");
  simpleTask("task2", "b");

  signals.initial.onNext();
  signals.reset.onNext();
  signals.playControl.onNext("pause");
  signals.currentCellType.onNext(EmptyCell);
  // Prime the pump with a first commit done to all the whole thing to get
  // started
  signals.commitDone.onNext();
});
