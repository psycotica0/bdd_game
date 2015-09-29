define(["cells/empty"], function(EmptyCell) {
  var CornerLTCell = function(signals) {
    this.contents = undefined;
    EmptyCell.call(this, signals);
  }

  CornerLTCell.prototype = Object.create(EmptyCell.prototype);
  CornerLTCell.constructor = CornerLTCell;

  CornerLTCell.prototype.update = function() {
    if (this.contents) {
      switch(this.contents.source) {
        case "left":
          this.top.pushBottom(this.contents.item, this);
          break;
        case "top":
          this.left.pushRight(this.contents.item, this);
      }
      this.nextState.contents = undefined;
    }
    EmptyCell.prototype.update.call(this);
  }

  CornerLTCell.prototype.resolve = function() {
    // Wrong direction
    if (this.nextState.inboundRight || this.nextState.inboundBottom) {
      this.signals.error.onNext();
    }

    // Meeting in the middle
    if (this.nextState.inboundLeft && this.nextState.inboundTop) {
      this.signals.error.onNext();
    }

    // Crossing paths
    if (
      (this.nextState.inboundLeft && this.contents && this.contents.source == "top") ||
      (this.nextState.inboundTop && this.contents && this.contents.source == "left")
    ) {
      this.signals.error.onNext();
    }


    this.signals.resolveDone.onNext();
  }

  CornerLTCell.prototype.rollbackLeft = function() {
    if (this.nextState.hasOwnProperty("inboundTop")) {
      this.nextState.inboundTop.sender.rollbackBottom();
      delete this.nextState.inboundTop;
    }
    delete this.nextState.contents;
  }

  CornerLTCell.prototype.rollbackTop = function() {
    if (this.nextState.hasOwnProperty("inboundLeft")) {
      this.nextState.inboundLeft.sender.rollbackRight();
      delete this.nextState.inboundLeft;
    }
    delete this.nextState.contents;
  }

  CornerLTCell.prototype.rollbackRight =
  CornerLTCell.prototype.rollbackBottom = function() {
    throw new Error("Rollback from an unexpected direction");
  }

  CornerLTCell.prototype.commit = function() {
    if (this.nextState.hasOwnProperty("contents")) {
      this.contents = this.nextState.contents;
    }

    if (this.nextState.hasOwnProperty("inboundLeft")) {
      this.contents = {
        item: this.nextState.inboundLeft.item,
        source: "left"
      };
    } else if (this.nextState.hasOwnProperty("inboundTop")) {
      this.contents = {
        item: this.nextState.inboundTop.item,
        source: "top"
      };
    }

    EmptyCell.prototype.commit.call(this);
    if (this.setClass) {
      this.setClass(this.contents ? "full " + this.contents.item : "");
    }
  }

  CornerLTCell.prototype.render = function(root, svg, size) {
    dSrc = [
      ["M", 0, size * 3 / 4],
      ["A", size * 3/4, size * 3/4, 0, 0, 0, size * 3/4, 0],
      ["H", size / 4],
      ["A", size / 4, size / 4, 0, 0, 1, 0, size / 4],
      ["Z"]
    ];

    root.appendChild(svg("path", {d: dSrc.map(function(i){return i.join(" ")}).join(" "), class: "track"}));
    root.appendChild(svg("circle", {cx: size * 2 / 6, cy: size * 2 / 6, r: size/6, class: "box"}));
  }

  return CornerLTCell;
});
