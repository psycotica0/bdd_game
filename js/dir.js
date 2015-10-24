define(function() {
  var left = {label: "LEFT", order: 0};
  left.jasmineToString = left.toString = function() {return "{LEFT}"}
  

  var right = {label: "RIGHT", order: 1};
  right.jasmineToString = right.toString = function() {return "{RIGHT}"}

  var top = {label: "TOP", order: 2};
  top.jasmineToString = top.toString = function() {return "{TOP}"}

  var bottom = {label: "BOTTOM", order: 3};
  bottom.jasmineToString = bottom.toString = function() {return "{BOTTOM}"}

  left.opposite = right;
  right.opposite = left;

  top.opposite = bottom;
  bottom.opposite = top;

  return {
    left: left,
    right: right,
    top: top,
    bottom: bottom
  }
});
