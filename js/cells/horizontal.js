define(["cells/simple", "dir"], function(SimpleCell, Dir) {
  var HorizontalCell = function(signals) {
    SimpleCell.call(this, signals);
    this.bidirectional(Dir.left, Dir.right);
  }

  HorizontalCell.prototype = Object.create(SimpleCell.prototype);
  HorizontalCell.constructor = HorizontalCell;
  return HorizontalCell;
});
