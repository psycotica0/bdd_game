requirejs(["rx", "signals", "testElement", "occasionalElement"], function(Rx, Signals, TestElement, OccasionalElement) {
  var i1 = new TestElement("1", "a");
  var i2 = new TestElement("2", "b");
  i1.next = i2
  var i3 = new TestElement("3", false);
  i2.next = i3
  var i4 = new TestElement("4", "c");
  i3.next = i4
  var i5 = new OccasionalElement("5", false, 2);
  i4.next = i5
  var i6 = new OccasionalElement("6", false, 5);
  i5.next = i6
  var i7 = new TestElement("7", false);
  i6.next = i7
  i7.next = i1

  Signals.initial.onNext()
});
