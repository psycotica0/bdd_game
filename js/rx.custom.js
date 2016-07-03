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
});
