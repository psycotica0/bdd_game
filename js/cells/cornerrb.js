define(["cells/empty"], function(EmptyCell) {
  var CornerRBCell = function(signals) {
    this.contents = undefined;
    EmptyCell.call(this, signals);
  }

  CornerRBCell.prototype = Object.create(EmptyCell.prototype);
  CornerRBCell.constructor = CornerRBCell;

  CornerRBCell.prototype.update = function() {
    if (this.contents) {
      switch(this.contents.source) {
        case "right":
          this.bottom.pushTop(this.contents.item, this);
          break;
        case "bottom":
          this.right.pushLeft(this.contents.item, this);
      }
      this.nextState.contents = undefined;
    }
    EmptyCell.prototype.update.call(this);
  }

  CornerRBCell.prototype.resolve = function() {
    // Wrong direction
    if (this.nextState.inboundLeft || this.nextState.inboundTop) {
      this.signals.error.onNext();
    }

    // Meeting in the middle
    if (this.nextState.inboundRight && this.nextState.inboundBottom) {
      this.signals.error.onNext();
    }

    // Crossing paths
    if (
      (this.nextState.inboundRight && this.contents && this.contents.source == "bottom") ||
      (this.nextState.inboundBottom && this.contents && this.contents.source == "right")
    ) {
      this.signals.error.onNext();
    }


    this.signals.resolveDone.onNext();
  }

  CornerRBCell.prototype.rollbackRight = function() {
    if (this.nextState.hasOwnProperty("inboundBottom")) {
      this.nextState.inboundBottom.sender.rollbackTop();
      delete this.nextState.inboundBottom;
    }
    delete this.nextState.contents;
  }

  CornerRBCell.prototype.rollbackBottom = function() {
    if (this.nextState.hasOwnProperty("inboundRight")) {
      this.nextState.inboundRight.sender.rollbackLeft();
      delete this.nextState.inboundRight;
    }
    delete this.nextState.contents;
  }

  CornerRBCell.prototype.rollbackLeft =
  CornerRBCell.prototype.rollbackTop = function() {
    throw new Error("Rollback from an unexpected direction");
  }

  CornerRBCell.prototype.commit = function() {
    if (this.nextState.hasOwnProperty("contents")) {
      this.contents = this.nextState.contents;
    }

    if (this.nextState.hasOwnProperty("inboundRight")) {
      this.contents = {
        item: this.nextState.inboundRight.item,
        source: "right"
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

  CornerRBCell.prototype.render = function(root, svg, size) {
    dSrc = [
      ["M", size * 1 / 4, size],
      ["A", size * 3 / 4, size * 3 / 4, 0, 0, 1, size, size/4],
      ["V", size * 3/ 4],
      ["A", size / 4, size / 4, 0, 0, 0, size * 3 / 4, size],
      ["Z"]
    ];

    root.appendChild(svg("path", {d: dSrc.map(function(i){return i.join(" ")}).join(" "), class: "track"}));
    root.appendChild(svg("circle", {cx: size * 4 / 6, cy: size * 4 / 6, r: size/6, class: "box"}));
  }

  return CornerRBCell;
});
