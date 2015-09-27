define(function() {
  var EmptyCell = function(signals) {
    this.signals = signals;
    this.nextState = {}
    this.signals.update.subscribe(this.update.bind(this));
    this.signals.resolve.subscribe(this.resolve.bind(this));
  };

  EmptyCell.prototype.update = function() {
    this.signals.updateDone.onNext();
  };

  EmptyCell.prototype.resolve = function() {
    if (
      this.nextState.inboundTop ||
      this.nextState.inboundBottom ||
      this.nextState.inboundRight ||
      this.nextState.inboundLeft
    ) {
      // It's always an error for the EmptyCell to receive anything
      this.signals.error.onNext();
    }
    this.signals.resolveDone.onNext();
  };

  EmptyCell.prototype.commit = function() {
    this.nextState = {};
  };

  EmptyCell.prototype.pushTop = function(item, sender) {
    this.nextState.inboundTop = {item: item, sender: sender}
  }

  EmptyCell.prototype.pushBottom = function(item, sender) {
    this.nextState.inboundBottom = {item: item, sender: sender}
  }

  EmptyCell.prototype.pushLeft = function(item, sender) {
    this.nextState.inboundLeft = {item: item, sender: sender}
  }

  EmptyCell.prototype.pushRight = function(item, sender) {
    this.nextState.inboundRight = {item: item, sender: sender}
  }

  return EmptyCell;
});
