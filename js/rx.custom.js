define(["rx"], function(Rx) {
  Rx.Observable.prototype.downsample = function(factor) {
    return this.map(function(i) {
        return Math.floor(i / factor);
      }).distinctUntilChanged();
  }

  Rx.Observable.prototype.tally = function() {
    return this.scan(function(acc) {
      return acc + 1;
    }, -1);
  }

  Rx.Observable.prototype.succ = function() {
    return this.map(function(n) {return n+1;});
  }
});
