define(["cells/simple", "dir"], function(SimpleCell, Dir) {
  var CornerTRCell = function(signals) {
    SimpleCell.call(this, signals);
    this.bidirectional(Dir.top, Dir.right);
  }

  CornerTRCell.prototype = Object.create(SimpleCell.prototype);
  CornerTRCell.constructor = CornerTRCell;

  CornerTRCell.prototype.render = function(root, svg, size) {
    dSrc = [
      ["M", size * 1 / 4, 0],
      ["A", size * 3 / 4, size * 3 / 4, 0, 0, 0, size, size * 3 / 4],
      ["V", size * 1/ 4],
      ["A", size / 4, size / 4, 0, 0, 1, size * 3 / 4, 0],
      ["Z"]
    ];

    root.appendChild(svg("path", {d: dSrc.map(function(i){return i.join(" ")}).join(" "), class: "track"}));
    root.appendChild(svg("circle", {cx: size * 4 / 6, cy: size * 2 / 6, r: size/6, class: "box"}));
  }

  return CornerTRCell;
});
