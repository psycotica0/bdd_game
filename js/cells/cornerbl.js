define(["cells/simple", "dir"], function(SimpleCell, Dir) {
  var CornerBLCell = function(signals) {
    SimpleCell.call(this, signals);
    this.bidirectional(Dir.bottom, Dir.left);
  }

  CornerBLCell.prototype = Object.create(SimpleCell.prototype);
  CornerBLCell.constructor = CornerBLCell;

  CornerBLCell.prototype.render = function(root, svg, size) {
    dSrc = [
      ["M", size * 3 / 4, size],
      ["A", size * 3/4, size * 3/4, 0, 0, 0, 0, size/4],
      ["V", size * 3/ 4],
      ["A", size / 4, size / 4, 0, 0, 1, size / 4, size],
      ["Z"]
    ];

    root.appendChild(svg("path", {d: dSrc.map(function(i){return i.join(" ")}).join(" "), class: "track"}));
    root.appendChild(svg("circle", {cx: size * 2 / 6, cy: size * 4 / 6, r: size/6, class: "box"}));
  }

  return CornerBLCell;
});
