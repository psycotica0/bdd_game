define(["cells/simple", "dir"], function(SimpleCell, Dir) {
  var Exclusive4 = function(signals) {
    SimpleCell.call(this, signals);
    this.bidirectional(Dir.left, Dir.right);
    this.bidirectional(Dir.top, Dir.bottom);
  }

  Exclusive4.prototype = Object.create(SimpleCell.prototype);
  Exclusive4.constructor = Exclusive4;

  Exclusive4.prototype.render = function(root, svg, size) {
    points = [
      [size * 0 / 4, size * 1 / 4],
      [size * 1 / 4, size * 1 / 4],
      [size * 1 / 4, size * 0 / 4],
      [size * 3 / 4, size * 0 / 4],
      [size * 3 / 4, size * 1 / 4],
      [size * 4 / 4, size * 1 / 4],
      [size * 4 / 4, size * 3 / 4],
      [size * 3 / 4, size * 3 / 4],
      [size * 3 / 4, size * 4 / 4],
      [size * 1 / 4, size * 4 / 4],
      [size * 1 / 4, size * 3 / 4],
      [size * 0 / 4, size * 3 / 4],
    ]
    
    root.appendChild(svg("polygon", {
      points: points.map(function(i){return i.join(",")}).join(" "),
      class: "track"
    }));
    root.appendChild(svg("circle", {cx: size * 3 / 6, cy: size * 3 / 6, r: size/6, class: "box"}));
  }

  return Exclusive4;
});
