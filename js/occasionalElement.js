define(["rx", "signals", "testElement"], function(Rx, Signals, TestElement) {
  OccasionalElement = function (id, full, number) {
    this.mod = number
    this.current = 0
    TestElement.call(this, id, full);
  }

  OccasionalElement.prototype = Object.create(TestElement.prototype)
  OccasionalElement.prototype.constructor = OccasionalElement

  OccasionalElement.prototype.update = function() {
    this.nextState.current = (this.current + 1) % this.mod;
    TestElement.prototype.update.call(this);
  }

  OccasionalElement.prototype.resolve = function() {
    if (this.nextState.current != 0 && this.nextState.hasOwnProperty("inbound")) {
      // We're Done For!!
      this.nextState.inbound.sender.rollBack();
      delete this.nextState.inbound;
    }

    Signals.resolveDone.onNext();
    TestElement.prototype.resolve.call(this);
  }

  OccasionalElement.prototype.commit = function() {
    if (this.nextState.hasOwnProperty("current")) {
      this.current = this.nextState.current;
    }
    TestElement.prototype.commit.call(this);
  }

  OccasionalElement.prototype.setClass = function() {
    var classes = []
    if (this.full) classes.push(this.full);
    if (this.current != 0) classes.push("blocked");

    document.getElementById(this.id).setAttribute("class", classes.join(" "))
  }

  return OccasionalElement;
});
