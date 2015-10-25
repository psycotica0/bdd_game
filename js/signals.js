define(["rx"], function(Rx) {
  var initialSignal = new Rx.Subject();

  var clockSignal = new Rx.Observable.timer(2000, 2000);
  var stepSignal = new Rx.Subject();

  var updateSelector = new Rx.Subject();
  var updateSignal = updateSelector.flatMapLatest(function(value) {
    return (value == "play" ? clockSignal : stepSignal);
  });

  var updateDoneSignal = new Rx.Subject();

  var resolveSignal = updateDoneSignal.debounce(100);
  var resolveDoneSignal = new Rx.Subject();

  var commitSignal = resolveDoneSignal.debounce(100);

  return {
    initial: initialSignal,
    playControl: updateSelector,
    step: stepSignal,
    update: updateSignal,
    updateDone: updateDoneSignal,
    resolve: resolveSignal,
    resolveDone: resolveDoneSignal,
    commit: commitSignal,
    error: new Rx.Subject(),
  }
});
