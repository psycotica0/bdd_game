requirejs([
  "rx", "signals",
  "cells/horizontal", "cells/empty",
  "cells/cornerlt", "cells/cornerbl",
  "cells/cornerrb", "drawingCell",
  "cells/exclusive4"
  ], function(
  Rx, signals,
  HorizontalCell, EmptyCell,
  CornerLTCell, CornerBLCell,
  CornerRBCell, DrawingCell,
  Exclusive4
) {
  var svg = document.getElementById("grid");
  var last;

  var meow = [
    "EE4H3",
    "HH+H2",
    "EH2EE",
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

  function snd(one, two) {
    return two;
  }

  function divides(n) {
    return function(i) {
      return i % n == 0;
    }
  }
  var push = Rx.Observable.zip(
    signals.update.filter(divides(3)),
    Rx.Observable.from(["a", "b", "c", "d"]),
    snd
  );

  push.subscribe(function(item) {
    DrawingCell.getAt(0,1).backingCell.pushLeft(item, undefined);
  });
});
