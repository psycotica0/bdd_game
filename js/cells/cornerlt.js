define(["cells/simple", "dir"], function(SimpleCell, Dir) {
  var CornerLTCell = function(signals) {
    SimpleCell.call(this, signals);
    this.bidirectional(Dir.left, Dir.top);
  }

  CornerLTCell.prototype = Object.create(SimpleCell.prototype);
  CornerLTCell.constructor = CornerLTCell;

  CornerLTCell.prototype.render = function(root, svg, size) {
    dSrc = [
      ["M", 0, size * 3 / 4],
      ["A", size * 3/4, size * 3/4, 0, 0, 0, size * 3/4, 0],
      ["H", size / 4],
      ["A", size / 4, size / 4, 0, 0, 1, 0, size / 4],
      ["Z"]
    ];

    root.appendChild(svg("path", {d: dSrc.map(function(i){return i.join(" ")}).join(" "), class: "track"}));
    root.appendChild(svg("circle", {cx: size * 2 / 6, cy: size * 2 / 6, r: size/6, class: "box"}));
  }

  return CornerLTCell;
});
