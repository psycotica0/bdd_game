define(["conf"], function(Conf) {
  // This is to lookup neightbours
  var registry = {};

  function svgElem (node, attributes) {
    var elem = document.createElementNS("http://www.w3.org/2000/svg", node);
    for (key in attributes) {
      elem.setAttribute(key, attributes[key]);
    }
    return elem;
  }

  function DrawingCell(x, y, dest, backingCell, signals, editable) {
    this.signals = signals;
    this.x = x
    this.y = y
    this.backingCell = backingCell;

    this.node = svgElem("svg", {x: x * Conf.cellSize, y: y * Conf.cellSize, width: Conf.cellSize, height: Conf.cellSize});
    this.populate(backingCell);

    signals.initial.subscribe(this.connect.bind(this));
    if (editable) {
      Rx.Observable.fromEvent(this.node, "click").
        withLatestFrom(signals.currentCellType, function(e, cellType) {
          return cellType;
        }).subscribe(this.buildBackingCell.bind(this));
    }
    dest.appendChild(this.node);

    registry[x] = registry[x] || {}
    registry[x][y] = this
  }

  DrawingCell.prototype.populate = function(newBackingCell) {
    // Clear out the node
    while(this.node.firstChild) {
      this.node.removeChild(this.node.firstChild);
    }
    this.node.appendChild(svgElem("rect", {x:0, y:0, width: Conf.cellSize, height: Conf.cellSize, class:"grid"}));

    this.backingCell = newBackingCell;
    this.backingCell.render(this.node, svgElem, Conf.cellSize);

    this.backingCell.setClass = this.setClass.bind(this);
  }

  DrawingCell.prototype.setClass = function(klass) {
    this.node.setAttribute("class", klass);
  }

  DrawingCell.prototype.connect = function() {
    var left = (registry[this.x - 1] || {})[this.y];
    var right = (registry[this.x + 1] || {})[this.y];
    var top = (registry[this.x] || {})[this.y-1];
    var bottom = (registry[this.x] || {})[this.y+1];

    if (left) {
      this.backingCell.left = left.backingCell;
      left.backingCell.right = this.backingCell;
    }
    if (right) {
      this.backingCell.right = right.backingCell;
      right.backingCell.left = this.backingCell;
    }
    if (top) {
      this.backingCell.top = top.backingCell;
      top.backingCell.bottom = this.backingCell;
    }
    if (bottom) {
      this.backingCell.bottom = bottom.backingCell;
      bottom.backingCell.top = this.backingCell;
    }
  }

  DrawingCell.prototype.buildBackingCell = function(cellType) {
    this.populate(new cellType(this.signals));
    this.connect();
  }

  DrawingCell.getAt = function(x, y) {
    return registry[x][y];
  }

  return DrawingCell;
});
