define(["rx"], function(Rx) {
  Rx.Observable.prototype.downsample = function(factor) {
    return this.map(function(i) {
        return Math.floor(i / factor);
      }).distinctUntilChanged();
  }

  Rx.Observable.prototype.tally = function(start) {
    start = start || 0;
    return this.scan(function(acc) {
      return acc + 1;
    }, start - 1);
  }

  // This version is like tally, except it fires the initial value immediately,
  // and then counts up with each value from there
  Rx.Observable.prototype.tallyStart = function(start) {
    start = start || 0;
    return this.tally(start + 1).startWith(start);
  }

  // This function subscribes to the stream and puts the result in the passed
  // in entity
  Rx.Observable.prototype.publishInto = function(domEntity) {
    return this.subscribe(function(value) {
      domEntity.textContent = value;
    });
  }
});
