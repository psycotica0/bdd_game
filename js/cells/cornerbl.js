define(["cells/empty"], function(EmptyCell) {
  var CornerBLCell = function(signals) {
    this.contents = undefined;
    EmptyCell.call(this, signals);
  }

  CornerBLCell.prototype = Object.create(EmptyCell.prototype);
  CornerBLCell.constructor = CornerBLCell;

  CornerBLCell.prototype.update = function() {
    if (this.contents) {
      switch(this.contents.source) {
        case "left":
          this.bottom.pushTop(this.contents.item, this);
          break;
        case "bottom":
          this.left.pushRight(this.contents.item, this);
      }
      this.nextState.contents = undefined;
    }
    EmptyCell.prototype.update.call(this);
  }

  CornerBLCell.prototype.resolve = function() {
    // Wrong direction
    if (this.nextState.inboundRight || this.nextState.inboundTop) {
      this.signals.error.onNext();
    }

    // Meeting in the middle
    if (this.nextState.inboundLeft && this.nextState.inboundBottom) {
      this.signals.error.onNext();
    }

    // Crossing paths
    if (
      (this.nextState.inboundLeft && this.contents && this.contents.source == "bottom") ||
      (this.nextState.inboundBottom && this.contents && this.contents.source == "left")
    ) {
      this.signals.error.onNext();
    }


    this.signals.resolveDone.onNext();
  }

  CornerBLCell.prototype.rollbackLeft = function() {
    if (this.nextState.hasOwnProperty("inboundBottom")) {
      this.nextState.inboundBottom.sender.rollbackTop();
      delete this.nextState.inboundBottom;
    }
    delete this.nextState.contents;
  }

  CornerBLCell.prototype.rollbackBottom = function() {
    if (this.nextState.hasOwnProperty("inboundLeft")) {
      this.nextState.inboundLeft.sender.rollbackRight();
      delete this.nextState.inboundLeft;
    }
    delete this.nextState.contents;
  }

  CornerBLCell.prototype.rollbackRight =
  CornerBLCell.prototype.rollbackTop = function() {
    throw new Error("Rollback from an unexpected direction");
  }

  CornerBLCell.prototype.commit = function() {
    if (this.nextState.hasOwnProperty("contents")) {
      this.contents = this.nextState.contents;
    }

    if (this.nextState.hasOwnProperty("inboundLeft")) {
      this.contents = {
        item: this.nextState.inboundLeft.item,
        source: "left"
      };
    } else if (this.nextState.hasOwnProperty("inboundBottom")) {
      this.contents = {
        item: this.nextState.inboundBottom.item,
        source: "bottom"
      };
    }

    EmptyCell.prototype.commit.call(this);
    if (this.setClass) {
      this.setClass(this.contents ? "full " + this.contents.item : "");
    }
  }

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
