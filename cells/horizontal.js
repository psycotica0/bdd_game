define(["cells/basic"], function(BasicCell) {
  var HorizontalCell = function() {
    BasicCell.call(this);
  }
  HorizontalCell.prototype = Object.create(BasicCell.prototype);
  HorizontalCell.constructor = HorizontalCell;

  HorizontalCell.prototype.pushLeft = function(item) {
    return this.right && this.right.pushLeft(item);
  }

  HorizontalCell.prototype.pushRight = function(item) {
    return this.left && this.left.pushRight(item);
  }

  return HorizontalCell;
});
