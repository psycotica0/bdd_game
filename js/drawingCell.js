define(function() {
  var size = 50;
  // This is to lookup neightbours
  var registry = {};

  function svgElem (node, attributes) {
    var elem = document.createElementNS("http://www.w3.org/2000/svg", node);
    for (key in attributes) {
      elem.setAttribute(key, attributes[key]);
    }
    return elem;
  }

  function DrawingCell(x, y, dest, backingCell, signals) {
    this.x = x
    this.y = y
    this.backingCell = backingCell;

    this.node = svgElem("svg", {x: x * size, y: y * size, width: size, height: size});
    this.backingCell.render(this.node, svgElem, size);
    dest.appendChild(this.node);

    this.backingCell.setClass = this.setClass.bind(this);

    signals.initial.subscribe(this.connect.bind(this));

    registry[x] = registry[x] || {}
    registry[x][y] = this
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

  DrawingCell.getAt = function(x, y) {
    return registry[x][y];
  }

  return DrawingCell;
});
