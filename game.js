requirejs(["rx"], function(Rx) {
  var initialSignal = new Rx.Subject();

  var updateSignal = new Rx.Observable.timer(2000, 2000);
  var updateDoneSignal = new Rx.Subject();

  var resolveSignal = updateDoneSignal.debounce(100);
  var resolveDoneSignal = new Rx.Subject();

  var commitSignal = resolveDoneSignal.debounce(100);

  TestElement = function (id, full) {
    this.id = id;
    this.full = full;
    this.nextState = {};
    initialSignal.subscribe(this.setClass.bind(this));
    updateSignal.subscribe(this.update.bind(this));
    resolveSignal.subscribe(this.resolve.bind(this));
    commitSignal.subscribe(this.commit.bind(this));
  }

  TestElement.prototype.setClass = function() {
    document.getElementById(this.id).setAttribute("class", this.full || "")
  }

  TestElement.prototype.update = function() {
    this.moveNext();
    updateDoneSignal.onNext({});
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
    resolveDoneSignal.onNext({});
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

    resolveDoneSignal.onNext({});
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

  var i1 = new TestElement("1", "a");
  var i2 = new TestElement("2", "b");
  i1.next = i2
  var i3 = new TestElement("3", false);
  i2.next = i3
  var i4 = new TestElement("4", "c");
  i3.next = i4
  var i5 = new OccasionalElement("5", false, 2);
  i4.next = i5
  var i6 = new OccasionalElement("6", false, 5);
  i5.next = i6
  var i7 = new TestElement("7", false);
  i6.next = i7
  i7.next = i1

  initialSignal.onNext({})
});
