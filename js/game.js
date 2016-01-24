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
        cell = new EmitterR(signals);
      else if (x == 5 && y == 3)
        cell = new SinkR(signals);
      else
        cell = new EmptyCell(signals);

      new DrawingCell(x, y, svg, cell, signals, cell instanceof EmptyCell);
    }
  }

  {
    var errorSpan = document.getElementById("errors");
    signals.initial.subscribe(function() {
      errorSpan.textContent = "";
    });
    signals.error.tally().succ().subscribe(function(errorCount) {
      errorSpan.textContent = errorCount;
    });
  }

  {
    var task = document.getElementById("task1");
    var successSpan = document.querySelector("#task1 .progress");
    signals.initial.subscribe(function() {
      successSpan.textContent = "0";
    });
    signals.received.tally().succ().subscribe(function(successCount) {
      successSpan.textContent = successCount;
      if (successCount == 10) {
        task.setAttribute("class", "complete");
      }
    });
  }

  signals.initial.onNext();
  signals.playControl.onNext("pause");
  signals.currentCellType.onNext(EmptyCell);
});
