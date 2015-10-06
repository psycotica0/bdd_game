define(["cells/empty"], function(EmptyCell) {
  var Exclusive4 = function(signals) {
    this.contents = undefined;
    EmptyCell.call(this, signals);
  }

  Exclusive4.prototype = Object.create(EmptyCell.prototype);
  Exclusive4.constructor = Exclusive4;

  Exclusive4.prototype.update = function() {
    if (this.contents) {
      switch(this.contents.source) {
        case "left":
          this.right.pushLeft(this.contents.item, this);
          break;
        case "right":
          this.left.pushRight(this.contents.item, this);
          break;
        case "top":
          this.bottom.pushTop(this.contents.item, this);
          break;
        case "bottom":
          this.top.pushBottom(this.contents.item, this);
          break;
      }
      this.nextState.contents = undefined;
    }
    EmptyCell.prototype.update.call(this);
  }

  Exclusive4.prototype.resolve = function() {
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

    // TODO: Other directions

    // Blocking Collision
    if (this.nextState.inboundLeft && this.nextState.inboundTop) {
      // Push back on horizontal before vertical
      this.left.rollbackRight();
      delete this.nextState.inboundLeft;
    }

    // TODO: Other directions


    this.signals.resolveDone.onNext();
  }

  // TODO: Other directions
  Exclusive4.prototype.rollbackLeft = function() {
    if (this.nextState.hasOwnProperty("inboundRight")) {
      this.nextState.inboundRight.sender.rollbackLeft();
      delete this.nextState.inboundRight;
    }
    delete this.nextState.contents;
  }

  Exclusive4.prototype.rollbackRight = function() {
    if (this.nextState.hasOwnProperty("inboundLeft")) {
      this.nextState.inboundLeft.sender.rollbackRight();
      delete this.nextState.inboundLeft;
    }
    delete this.nextState.contents;
  }

  // TODO
  Exclusive4.prototype.rollbackTop =
  Exclusive4.prototype.rollbackBottom = function() {
    throw new Error("Rollback from an unexpected direction");
  }

  Exclusive4.prototype.commit = function() {
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
    } else if (this.nextState.hasOwnProperty("inboundTop")) {
      this.contents = {
        item: this.nextState.inboundTop.item,
        source: "top"
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
