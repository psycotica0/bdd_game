define(["rx", "rx.custom"], function(Rx) {
  var initialSignal = new Rx.Subject();

  var clockSignal = new Rx.Observable.timer(700, 700);
  var stepSignal = new Rx.Subject();

  var commitDoneSignal = new Rx.Subject();

  var updateSelector = new Rx.Subject();
  var updateSignal = updateSelector.flatMapLatest(function(value) {
    return (value == "play" ? clockSignal : stepSignal);
  }).zipLatest(commitDoneSignal.debounce(100), function(a,b){return a}).share();

  var updateDoneSignal = new Rx.Subject();

  var resolveSignal = updateDoneSignal.debounce(100);
  var resolveDoneSignal = new Rx.Subject();

  var commitSignal = resolveDoneSignal.debounce(100);

  var received = new Rx.Subject();

  return {
    initial: initialSignal,
    playControl: updateSelector,
    step: stepSignal,
    level: new Rx.Subject(),
    update: updateSignal,
    updateDone: updateDoneSignal,
    resolve: resolveSignal,
    resolveDone: resolveDoneSignal,
    commit: commitSignal,
    commitDone: commitDoneSignal,
    error: new Rx.Subject(),
    currentCellType: new Rx.Subject(),
    reset: new Rx.Subject(),
    taskCompleted: new Rx.Subject(),
    received: received
  }
});
