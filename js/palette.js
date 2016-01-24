define(["signals", "conf",
  "cells/horizontal", "cells/empty",
  "cells/cornerlt", "cells/cornerbl",
  "cells/cornerrb", "cells/cornertr", 
  "cells/exclusive4", "cells/vertical"
  ], function(signals, Conf,
    HorizontalCell, EmptyCell,
    Corner2, Corner3,
    Corner4, Corner1,
    Exclusive4, VerticalCell
    ) {

  function svgElem (node, attributes) {
    var elem = document.createElementNS("http://www.w3.org/2000/svg", node);
    for (key in attributes) {
      elem.setAttribute(key, attributes[key]);
    }
    return elem;
  }

  var items = [HorizontalCell, VerticalCell, EmptyCell, Corner1, Corner2, Corner3, Corner4, Exclusive4];

  var mockSignals = {};
  // This builds a set of signals that will never fire to give to palette items
  for (var s in signals) {
    if (signals.hasOwnProperty(s)) {
      mockSignals[s] = new Rx.Subject();
    }
  }

  function select(node) {
    while(document.querySelector("#palette .selected")) {
      document.querySelector("#palette .selected").setAttribute("class", "");
    }

    node.setAttribute("class", "selected");
  }

  function setup() {
    var root = document.getElementById("palette");
    root.setAttribute("height", Conf.cellSize);
    root.setAttribute("width", Conf.cellSize * items.length);

    items.forEach(function(constructor, index) {
      var node = svgElem("svg", {x: index * Conf.cellSize, y: 0, width: Conf.cellSize, height: Conf.cellSize});
      node.appendChild(svgElem("rect", {x:0, y:0, width: Conf.cellSize, height: Conf.cellSize, class:"grid"}));
      Rx.Observable.fromEvent(node, "click").subscribe(function() {
        signals.currentCellType.onNext(constructor);
        select(node);
      });

      var cell = new constructor(mockSignals);
      cell.render(node, svgElem, Conf.cellSize);
      root.appendChild(node);
    })
  }

  signals.initial.subscribe(function(item) {
    setup();
  });
  return true;
});
