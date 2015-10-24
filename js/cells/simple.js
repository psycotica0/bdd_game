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
    // Detect pushes from unconnected directions
    var error = _(this.nextState.inbound).any(function(item) {
      return !this.connection[item.source];
    }, this);

    // Detect pushes from both sides of a connection
    error = error || _.reduce(this.nextState.inbound, function(acc, item) {
      // If this source was already a destination, then collision
      if (_.includes(acc.dests, item.source)) {
        acc.collision = true;
      }
      // Push this destination into the list for the future
      acc.dests.push(this.connection[item.source]);
      return acc;
    }, {collision: false, dests: []}, this).collision;

    // Detect pushes from the same side we've pushed to
    if (this.content) {
      error = error || _(this.nextState.inbound).
        map('source').
        includes(this.connection[this.content.source]);
    }

    if (error) {
      this.signals.error.onNext();
      delete this.nextState.inbound;
    }

    // Only allow one inbound at a time
    if (this.nextState.inbound && this.nextState.inbound.length > 1) {
      var sorted = _(this.nextState.inbound).sortBy("source.order");

      sorted.
        rest().
        forEach(function(item) {
          item.sender.rollback(item.source.opposite);
        }).
        commit();

      this.nextState.inbound = [sorted.first()];
    }

    this.signals.resolveDone.onNext();
  };

  SimpleCell.prototype.commit = function() {
    if (this.nextState) {
      if (this.nextState.hasOwnProperty('content')) {
        this.content = this.nextState.content
      }

      _.forEach(this.nextState.inbound, function(item) {
        this.content = {
          item: item.item,
          source: item.source
        };
      }, this);
    }
    this.nextState = {};
    if (this.setClass) {
      this.setClass(this.content ? "full " + this.content.item : "");
    }
  };

  SimpleCell.prototype.push = function(dir, item, sender) {
    this.nextState.inbound = this.nextState.inbound || [];
    this.nextState.inbound.push({
      item: item,
      sender: sender,
      source: dir
    });
  }

  SimpleCell.prototype.render = function(root, svg, size) {
  }

  SimpleCell.prototype.pushTop = _.partial(SimpleCell.prototype.push, Dir.top);
  SimpleCell.prototype.pushLeft = _.partial(SimpleCell.prototype.push, Dir.left);
  SimpleCell.prototype.pushRight = _.partial(SimpleCell.prototype.push, Dir.right);
  SimpleCell.prototype.pushBottom = _.partial(SimpleCell.prototype.push, Dir.bottom);

  SimpleCell.prototype.rollback = function(dir) {
    _.forEach(this.nextState.inbound, function(item) {
      item.sender.rollback(item.source.opposite);
    });
    this.nextState = {};
  }

  // This function creates a bidirectional connection between the two
  // directions given
  SimpleCell.prototype.bidirectional = function(one, two) {
    this.connection[one] = two;
    this.connection[two] = one;
  }

  return SimpleCell;
});
