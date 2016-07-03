define(["lodash", "rx"], function(_, Rx) {

  var SimpleTask = function(domEntity, item, signals, level) {
    // Active when our level is <= than the one we're on
    var activeSignal = signals.level.map(_.partial(_.lte, [level]));

    var snd = function(a,b) {return b};

    signals.reset.combineLatest(activeSignal, snd).doOnNext(function(active) {
      domEntity.setAttribute("class",
        active ? "" : "inactive"
      );
    }).flatMapLatest(function(active) {
      // Count items received that we care about
      return signals.received
        .filter(_.partial(_.isEqual, item))
        .tally().succ().startWith(0);
    }).doOnNext(function(successCount) {
      if (successCount == 10) {
        domEntity.setAttribute("class", "complete");
        signals.taskCompleted.onNext();
      }
    }).subscribe(function(successCount) {
      domEntity.querySelector(".progress").textContent = successCount;
    });
  }

  return SimpleTask;
});
