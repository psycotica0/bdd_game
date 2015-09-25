define(["lodash"], function(_) {
  var BasicCell = function() {
  }

  var dirs = {
    left: "right",
    top: "bottom",
    right: "left",
    bottom: "top"
  }

  _.forOwn(dirs, function(dir, facing) {
    BasicCell.prototype["push" + _.capitalize(dir)] = function(item) {
      return undefined;
    }

    BasicCell.prototype["connect" + _.capitalize(dir)] = function(other) {
      this[dir] = other;
      other[facing] = this;
      return other;
    }
  });
  return BasicCell;
});
