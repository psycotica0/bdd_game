define(["signals"], function(Signals) {
  function resetClicked() {
    console.log("Reset");
  }
  function pauseClicked() {
    Signals.playControl.onNext("pause");
  }
  function playClicked() {
    Signals.playControl.onNext("play");
  }
  function nextClicked() {
    Signals.step.onNext();
  }

  function setup() {
    document.getElementById("reset").addEventListener("click", resetClicked);
    document.getElementById("pause").addEventListener("click", pauseClicked);
    document.getElementById("play").addEventListener("click", playClicked);
    document.getElementById("next").addEventListener("click", nextClicked);
  }

  Signals.initial.subscribe(function(item) {
    setup();
  });

  return true;
});
