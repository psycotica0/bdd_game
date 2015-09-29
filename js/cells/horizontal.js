define(["cells/empty"], function(EmptyCell) {
  var HorizontalCell = function(signals) {
    this.contents = undefined;
    EmptyCell.call(this, signals);
  }

  HorizontalCell.prototype = Object.create(EmptyCell.prototype);
  HorizontalCell.constructor = HorizontalCell;

  HorizontalCell.prototype.update = function() {
    if (this.contents) {
      switch(this.contents.source) {
        case "left":
          this.right.pushLeft(this.contents.item, this);
          break;
        case "right":
          this.left.pushRight(this.contents.item, this);
      }
      this.nextState.contents = undefined;
    }
    EmptyCell.prototype.update.call(this);
  }

  HorizontalCell.prototype.resolve = function() {
    // Wrong direction
    if (this.nextState.inboundTop || this.nextState.inboundBottom) {
      this.signals.error.onNext();
    }

    // Meeting in the middle
    if (this.nextState.inboundLeft && this.nextState.inboundRight) {
      this.signals.error.onNext();
    }

    // Crossing paths
    if (
      (this.nextState.inboundLeft && this.contents && this.contents.source == "right") ||
      (this.nextState.inboundRight && this.contents && this.contents.source == "left")
    ) {
      this.signals.error.onNext();
    }


    this.signals.resolveDone.onNext();
  }

  HorizontalCell.prototype.rollbackLeft = function() {
    if (this.nextState.hasOwnProperty("inboundRight")) {
      this.nextState.inboundRight.sender.rollbackLeft();
      delete this.nextState.inboundRight;
    }
    delete this.nextState.contents;
  }

  HorizontalCell.prototype.rollbackRight = function() {
    if (this.nextState.hasOwnProperty("inboundLeft")) {
      this.nextState.inboundLeft.sender.rollbackRight();
      delete this.nextState.inboundLeft;
    }
    delete this.nextState.contents;
  }

  HorizontalCell.prototype.rollbackTop =
  HorizontalCell.prototype.rollbackBottom = function() {
    throw new Error("Rollback from an unexpected direction");
  }

  HorizontalCell.prototype.commit = function() {
    if (this.nextState.hasOwnProperty("contents")) {
      this.contents = this.nextState.contents;
    }

    if (this.nextState.hasOwnProperty("inboundLeft")) {
      this.contents = {
        item: this.nextState.inboundLeft.item,
        source: "left"
      };
    } else if (this.nextState.hasOwnProperty("inboundRight")) {
      this.contents = {
        item: this.nextState.inboundRight.item,
        source: "right"
      };
    }

    EmptyCell.prototype.commit.call(this);
    if (this.setClass) {
      this.setClass(this.contents ? "full " + this.contents.item : "");
    }
  }

  HorizontalCell.prototype.render = function(root, svg, size) {
    root.appendChild(svg("rect", {x: 0, y: size / 4, width: size, height: size / 2, class: "track"}));
    root.appendChild(svg("circle", {cx: size * 3 / 6, cy: size * 3 / 6, r: size/6, class: "box"}));
  }

  return HorizontalCell;
});
