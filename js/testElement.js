define(["rx", "signals"], function(Rx, Signals) {
  TestElement = function (id, full) {
    this.id = id;
    this.full = full;
    this.nextState = {};
    Signals.initial.subscribe(this.setClass.bind(this));
    Signals.update.subscribe(this.update.bind(this));
    Signals.resolve.subscribe(this.resolve.bind(this));
    Signals.commit.subscribe(this.commit.bind(this));
  }

  TestElement.prototype.setClass = function() {
    document.getElementById(this.id).setAttribute("class", this.full || "")
  }

  TestElement.prototype.update = function() {
    this.moveNext();
    Signals.updateDone.onNext();
  }

  TestElement.prototype.moveNext = function() {
    if (this.full) {
      this.next.push(this.full, this)
      this.nextState.full = false;
    }
  }

  TestElement.prototype.push = function(item, sender) {
    this.nextState.inbound = {item: item, sender: sender};
  }

  TestElement.prototype.resolve = function() {
    Signals.resolveDone.onNext();
  }

  TestElement.prototype.commit = function() {
    if (this.nextState.hasOwnProperty("full")) {
      this.full = this.nextStateFull
    }
    if (this.nextState.hasOwnProperty("inbound")) {
      this.full = this.nextState.inbound.item
    }

    this.nextState = {}
    this.setClass();
  }

  TestElement.prototype.rollBack = function() {
    // Keep what we have
    delete this.nextState.full
    // Push back upstream
    if (this.nextState.hasOwnProperty("inbound")) {
      this.nextState.inbound.sender.rollBack();
      delete this.nextState.inbound;
    }
  }

  return TestElement
});
