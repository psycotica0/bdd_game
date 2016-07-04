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

  // This fires whenever both observables have fired, like zip, but unlike zip
  // it doesn't queue if one observable fires more often.
  // Only the latest items from each are produced, the others are discarded
  Rx.Observable.prototype.zipLatest = function(other, combineFunction) {
    var first = this;
    combineFunction = combineFunction || function(a, b) {return [a, b]};

    return Rx.Observable.create(function(obs) {

      var firstEmitted = false;
      var otherEmitted = false;
      var firstValue = undefined;
      var otherValue = undefined;

      var both = function() {
        if (firstEmitted && otherEmitted) {
          obs.onNext(combineFunction(firstValue, otherValue));
          firstEmitted = false;
          otherEmitted = false;
          firstValue = undefined;
          otherValue = undefined;
        }
      }

      var firstSubscription = first.subscribe(function(value) {
        firstEmitted = true;
        firstValue = value;
        both();
      }, obs.onError, obs.onCompleted);

      var otherSubscription = other.subscribe(function(value) {
        otherEmitted = true;
        otherValue = value;
        both();
      }, obs.onError, obs.onCompleted);

      return function() {
        firstSubscription.dispose();
        otherSubscription.dispose();
      }
    });
  }
});
