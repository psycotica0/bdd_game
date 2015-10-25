requirejs([
  "rx", "signals", "controls",
  "cells/horizontal", "cells/empty",
  "cells/cornerlt", "cells/cornerbl",
  "cells/cornerrb", "drawingCell",
  "cells/exclusive4", "cells/cornertr",
  "cells/emitter_r", "cells/sinkr"
  ], function(
  Rx, signals, controls,
  HorizontalCell, EmptyCell,
  CornerLTCell, CornerBLCell,
  CornerRBCell, DrawingCell,
  Exclusive4, CornerTRCell,
  EmitterR, SinkR
) {
  var svg = document.getElementById("grid");
  var last;

  var meow = [
    "E4343",
    "R+++2",
    "S212E",
  ]

  for (var y = 0; y < meow.length; y++) {
    for (var x = 0; x < meow[y].length; x++) {
      var consructor;
      switch(meow[y][x]) {
        case 'E':
          constructor = EmptyCell;
          break;
        case 'H':
          constructor = HorizontalCell;
          break;
        case '1':
          constructor = CornerTRCell;
          break;
        case '2':
          constructor = CornerLTCell;
          break;
        case '3':
          constructor = CornerBLCell;
          break;
        case '4':
          constructor = CornerRBCell;
          break;
        case '+':
          constructor = Exclusive4;
          break;
        case 'R':
          constructor = EmitterR;
          break;
        case 'S':
          constructor = SinkR;
          break;
      }
      new DrawingCell(x, y, svg, new constructor(signals), signals);
    }
  }

  {
    var errorCount = 0;
    var errorSpan = document.getElementById("errors");
    signals.initial.subscribe(function() {
      errorSpan.textContent = "";
    });
    signals.error.subscribe(function() {
      errorSpan.textContent = ++errorCount;
    });
  }

  {
    var successCount = 0;
    var task = document.getElementById("task1");
    var successSpan = document.querySelector("#task1 .progress");
    signals.initial.subscribe(function() {
      successSpan.textContent = successCount;
    });
    signals.received.subscribe(function() {
      successSpan.textContent = ++successCount;
      if (successCount == 10) {
        task.setAttribute("class", "complete");
      }
    });
  }

  signals.initial.onNext();
  signals.playControl.onNext("play");
});
