define(function() {
  var left = {label: "LEFT"};
  left.jasmineToString = left.toString = function() {return "{LEFT}"}
  

  var right = {label: "RIGHT"};
  right.jasmineToString = right.toString = function() {return "{RIGHT}"}

  var top = {label: "TOP"};
  top.jasmineToString = top.toString = function() {return "{TOP}"}

  var bottom = {label: "BOTTOM"};
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
