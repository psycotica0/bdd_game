requirejs(["rx", "signals", "cells/horizontal", "cells/empty", "cells/cornerlt", "drawingCell"], function(Rx, signals, HorizontalCell, EmptyCell, CornerLTCell, DrawingCell) {
  var svg = document.getElementById("grid");
  var last;

  var meow = [
    "EEEEE",
    "HHHH2",
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
        case '2':
          constructor = CornerLTCell;
      }
      new DrawingCell(x, y, svg, new constructor(signals), signals);
    }
  }

  var errorCount = 0;
  var errorSpan = document.getElementById("errors");
  signals.initial.subscribe(function() {
    errorSpan.textContent = errorCount;
  });
  signals.error.subscribe(function() {
    errorSpan.textContent = ++errorCount;
  });
  signals.initial.onNext();

  DrawingCell.getAt(0,1).backingCell.pushLeft("b", undefined);
});
