requirejs([
  "rx", "signals", "controls", "palette",
  "cells/empty", "drawingCell",
  "cells/emitter_r", "cells/sinkr",
  "conf", "task",
  "rx.custom"
  ], function(
  Rx, signals, controls, palette,
  EmptyCell, DrawingCell,
  EmitterR, SinkR,
  Conf, SimpleTask
) {
  var svg = document.getElementById("grid");

  svg.setAttribute("width", Conf.cellSize * Conf.gridWidth);
  svg.setAttribute("height", Conf.cellSize * Conf.gridHeight);

  var emit1 = new EmitterR(signals, "a");
  var emit2 = new EmitterR(signals, "b");

  var sink1 = new SinkR(signals, "a", "a");
  var sink2 = new SinkR(signals, "b", "b");

  for (var y = 0; y < Conf.gridHeight; y++) {
    for (var x = 0; x < Conf.gridWidth; x++) {
      var cell;
      if (x == 0 && y == 5)
        cell = emit1
      else if (x == 0 && y == 3)
        cell = emit2
      else if (x == 0 && y == 2)
        cell = sink1
      else if (x == 0 && y == 8)
        cell = sink2
      else
        cell = new EmptyCell(signals);

      new DrawingCell(x, y, svg, cell, signals, cell instanceof EmptyCell);
    }
  }

  var successScreen = document.getElementById("youDidItContainer");
  {
    // Move the You Did It Screen to the front
    svg.appendChild(successScreen);

    var animation = Rx.Observable.fromEvent(successScreen, "animationend");

    // Fade out is done, so hide the element so we can play
    animation.filter(
      _.matches({animationName: "fadeOut"})
    ).subscribe(function(e) {
      successScreen.setAttribute("class", "");
    })

    // Fade in is done, so wait a bit before setting hide
    animation.filter(
      _.matches({animationName: "fadeIn"})
    ).flatMapLatest(function(e) {
      return Rx.Observable.just().delay(2000);
    }).subscribe(function() {
      // Reset the level just before hiding
      signals.reset.onNext();
      successScreen.setAttribute("class", "hide");
    });
  }

  // Error Count Display
  // Clear on reset, count after that.
  signals.reset.flatMapLatest(function() {
    return signals.error.tallyStart();
  }).map(function(errorCount) {
    return errorCount == 0 ? "" : errorCount;
  }).publishInto(document.getElementById("errors"));

  signals.level.subscribe(function(n) {
    emit1.active = n > 0;
    emit2.active = n > 1;
  });

  {
    signals.level.publishInto(document.querySelector("#taskHeader .total"));

    var countSignal = signals.reset.flatMapLatest(function() {
      return signals.taskCompleted.tallyStart();
    });

    countSignal.publishInto(document.querySelector("#taskHeader .progress"));

    countSignal.combineLatest(signals.level).subscribe(_.spread(function(taskCount, taskTotal) {
      if (taskCount >= taskTotal) {
        signals.playControl.onNext("pause");
        signals.level.onNext(taskTotal + 1);
        successScreen.setAttribute("class", "display");
      }
    }));
  }

  var tasks = [
    SimpleTask(
      document.getElementById("task1"),
      "a",
      signals,
      1
    ),
    SimpleTask(
      document.getElementById("task2"),
      "b",
      signals,
      2
    )
  ];

  signals.level.onNext(1);
  signals.initial.onNext();
  signals.reset.onNext();
  signals.playControl.onNext("pause");
  signals.currentCellType.onNext(EmptyCell);
  // Prime the pump with a first commit done to all the whole thing to get
  // started
  signals.commitDone.onNext();
});
