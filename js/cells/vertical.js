define(["cells/simple", "dir"], function(SimpleCell, Dir) {
  var VerticalCell = function(signals) {
    SimpleCell.call(this, signals);
    this.bidirectional(Dir.top, Dir.bottom);
  }

  VerticalCell.prototype = Object.create(SimpleCell.prototype);
  VerticalCell.constructor = VerticalCell;

  VerticalCell.prototype.render = function(root, svg, size) {
    root.appendChild(svg("rect", {x: size / 4, y: 0, width: size / 2, height: size, class: "track"}));
    root.appendChild(svg("circle", {cx: size * 3 / 6, cy: size * 3 / 6, r: size/6, class: "box"}));
  }

  return VerticalCell;
});
