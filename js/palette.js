define(["signals",
  "cells/horizontal", "cells/empty",
  "cells/cornerlt", "cells/cornerbl",
  "cells/cornerrb", "cells/cornertr", 
  "cells/exclusive4",
  ], function(signals,
    HorizontalCell, EmptyCell,
    Corner2, Corner3,
    Corner4, Corner1,
    Exclusive4
    ) {

  function svgElem (node, attributes) {
    var elem = document.createElementNS("http://www.w3.org/2000/svg", node);
    for (key in attributes) {
      elem.setAttribute(key, attributes[key]);
    }
    return elem;
  }

  var items = [HorizontalCell, EmptyCell, Corner1, Corner2, Corner3, Corner4, Exclusive4];

  var size = 50;
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
    items.forEach(function(constructor, index) {
      var node = svgElem("svg", {x: index * size, y: 0, width: size, height: size});
      node.appendChild(svgElem("rect", {x:0, y:0, width: size, height: size, class:"grid"}));
      Rx.Observable.fromEvent(node, "click").subscribe(function() {
        signals.currentCellType.onNext(constructor);
        select(node);
      });

      var cell = new constructor(mockSignals);
      cell.render(node, svgElem, size);
      root.appendChild(node);
    })
  }

  signals.initial.subscribe(function(item) {
    setup();
  });
  return true;
});
