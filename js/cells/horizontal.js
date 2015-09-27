define(["cells/empty"], function(EmptyCell) {
  var HorizontalCell = function(signals) {
    this.contents = undefined;
    EmptyCell.call(this, signals);
  }

  HorizontalCell.prototype = Object.create(EmptyCell.prototype);
  HorizontalCell.constructor = HorizontalCell;

  HorizontalCell.prototype.update = function() {
    if (this.contents) {
      switch(this.contents.direction) {
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
    if (this.nextState.inboundTop || this.nextState.inboundBottom) {
      this.signals.error.onNext();
    }
    this.signals.resolveDone.onNext();
  }

  var rollback = function() {
    delete this.nextState.contents;
  };

  HorizontalCell.prototype.rollbackLeft = rollback;
  HorizontalCell.prototype.rollbackRight = rollback;
  HorizontalCell.prototype.rollbackTop = rollback;
  HorizontalCell.prototype.rollbackBottom = rollback;

  HorizontalCell.prototype.commit = function() {
    if (this.nextState.hasOwnProperty("contents")) {
      this.contents = this.nextState.contents;
    }

    if (this.nextState.hasOwnProperty("inboundLeft")) {
      this.contents = {
        item: this.nextState.inboundLeft.item,
        direction: "left"
      };
    } else if (this.nextState.hasOwnProperty("inboundRight")) {
      this.contents = {
        item: this.nextState.inboundRight.item,
        direction: "right"
      };
    }

    EmptyCell.prototype.commit.call(this);
  }

  return HorizontalCell;
});
