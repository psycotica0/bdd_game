define(["cells/simple", "dir"], function(SimpleCell, Dir) {
  var HorizontalCell = function(signals) {
    SimpleCell.call(this, signals);
    this.bidirectional(Dir.left, Dir.right);
  }

  HorizontalCell.prototype = Object.create(SimpleCell.prototype);
  HorizontalCell.constructor = HorizontalCell;

  HorizontalCell.prototype.render = function(root, svg, size) {
    root.appendChild(svg("rect", {x: 0, y: size / 4, width: size, height: size / 2, class: "track"}));
    root.appendChild(svg("circle", {cx: size * 3 / 6, cy: size * 3 / 6, r: size/6, class: "box"}));
  }

  return HorizontalCell;
});
