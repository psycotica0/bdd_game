requirejs(["rx", "signals", "cells/horizontal", "cells/empty", "drawingCell"], function(Rx, signals, HorizontalCell, EmptyCell, DrawingCell) {
  var svg = document.getElementById("grid");
  var last;

  var first = new DrawingCell(0, 0, svg, new HorizontalCell(signals), signals);
  new DrawingCell(1, 0, svg, new EmptyCell(signals), signals);

  for (var x = 2; x < 6; x++) {
    last = new DrawingCell(x, 0, svg, new HorizontalCell(signals), signals);
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

  last.backingCell.pushRight("a", undefined);
  first.backingCell.pushLeft("b", undefined);

});
