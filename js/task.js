define(["lodash", "rx"], function(_, Rx) {

  var SimpleTask = function(domEntity, item, signals, level) {
    var successSpan = domEntity.querySelector(".progress");
    signals.reset.subscribe(function() {
      successSpan.textContent = "0";
    });

    // Active when our level is <= than the one we're on
    var activeSignal = signals.level.map(_.partial(_.lte, [level]));

    var receiptDisposable;

    activeSignal.combineLatest(signals.reset).subscribe(function(comb) {
      var active = comb[0];
      domEntity.setAttribute("class",
        active ? "" : "inactive"
      );

      if (receiptDisposable)
        receiptDisposable.dispose();

      if (active) {
        receiptDisposable = signals.received
          .filter(_.partial(_.isEqual, item))
          .tally().succ().subscribe(function(successCount) {
            successSpan.textContent = successCount;
            if (successCount == 10) {
              domEntity.setAttribute("class", "complete");
              signals.taskCompleted.onNext();
            }
          });
      }
    });
  }

  return SimpleTask;
});
