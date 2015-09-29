requirejs([
  "rx", "signals",
  "cells/horizontal", "cells/empty",
  "cells/cornerlt", "cells/cornerbl",
  "cells/cornerrb", "drawingCell"
  ], function(
  Rx, signals,
  HorizontalCell, EmptyCell,
  CornerLTCell, CornerBLCell,
  CornerRBCell, DrawingCell
) {
  var svg = document.getElementById("grid");
  var last;

  var meow = [
    "E4HH3",
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
          break;
        case '3':
          constructor = CornerBLCell;
          break;
        case '4':
          constructor = CornerRBCell;
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

  var takeOnly;
  {
    var count = 0;
    takeOnly = function() {
      return (count++) % 3 == 0;
    }
  }
  signals.update.filter(takeOnly).take(4).subscribe(function() {
    DrawingCell.getAt(0,1).backingCell.pushLeft("b", undefined);
  });
});
