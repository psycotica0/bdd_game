requirejs([
  "rx", "signals", "controls",
  "cells/horizontal", "cells/empty",
  "cells/cornerlt", "cells/cornerbl",
  "cells/cornerrb", "drawingCell",
  "cells/exclusive4", "cells/cornertr",
  "cells/emitter_r", "cells/sinkr",
  "rx.custom"
  ], function(
  Rx, signals, controls,
  HorizontalCell, EmptyCell,
  CornerLTCell, CornerBLCell,
  CornerRBCell, DrawingCell,
  Exclusive4, CornerTRCell,
  EmitterR, SinkR
) {
  var svg = document.getElementById("grid");
  var gridWidth = 10;
  var gridHeight = 10;

  for (var y = 0; y < gridHeight; y++) {
    for (var x = 0; x < gridWidth; x++) {
      new DrawingCell(x, y, svg, new EmptyCell(signals), signals);
    }
  }


  DrawingCell.getAt(0,5).populate(new EmitterR(signals));

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
  signals.currentCellType.onNext(HorizontalCell);
});
