define(["lodash", "dir"], function(_, Dir) {
  var SimpleCell = function(signals) {
    this.signals = signals;
    this.nextState = {}
    this.content = undefined;
    this.connection = {};
    this.signals.update.subscribe(this.update.bind(this));
    this.signals.resolve.subscribe(this.resolve.bind(this));
    this.signals.commit.subscribe(this.commit.bind(this));
  };

  SimpleCell.prototype.jasmineToString = function() {
    return "{CELL}"
  }

  SimpleCell.prototype.update = function() {
    if (this.content) {
      var otherDir = this.connection[this.content.source];
      var other;
      switch(otherDir) {
        case Dir.left:
          other = this.left;
          break;
        case Dir.top:
          other = this.top;
          break;
        case Dir.right:
          other = this.right;
          break;
        case Dir.bottom:
          other = this.bottom;
          break;
        default:
          throw new Error("Tried getting other side of unconnected direction");
      }

      other.push(otherDir.opposite, this.content.item, this);
      this.nextState.content = undefined;
    }
    this.signals.updateDone.onNext();
  };

  SimpleCell.prototype.resolve = function() {
    for (dir in this.nextState.inbound) {
      if (!this.connection[dir]) {
        this.signals.error.onNext();
        this.nextState.inbound[dir] = undefined;
      }
    }
    this.signals.resolveDone.onNext();
  };

  SimpleCell.prototype.commit = function() {
    if (this.nextState) {
      if (this.nextState.hasOwnProperty('content')) {
        this.content = this.nextState.content
      }
      for (dir in this.nextState.inbound) {
        if (this.nextState.inbound[dir]) {
          this.content = {
            item: this.nextState.inbound[dir].item, 
            source: dir
          }
        }
      }
    }
    this.nextState = {};
  };

  SimpleCell.prototype.push = function(dir, item, sender) {
    this.nextState.inbound = this.nextState.inbound || {}
    this.nextState.inbound[dir] = {item: item, sender: sender}
  }

  SimpleCell.prototype.render = function(root, svg, size) {
  }

  SimpleCell.prototype.pushTop = _.partial(SimpleCell.prototype.push, Dir.top);
  SimpleCell.prototype.pushLeft = _.partial(SimpleCell.prototype.push, Dir.left);
  SimpleCell.prototype.pushRight = _.partial(SimpleCell.prototype.push, Dir.right);
  SimpleCell.prototype.pushBottom = _.partial(SimpleCell.prototype.push, Dir.bottom);

  // This function creates a bidirectional connection between the two
  // directions given
  SimpleCell.prototype.bidirectional = function(one, two) {
    this.connection[one] = two;
    this.connection[two] = one;
  }

  return SimpleCell;
});
