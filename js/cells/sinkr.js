define(["dir"], function(Dir) {
  var SinkR = function(signals, item) {
    this.signals = signals;
    this.item = item
    this.signals.resolve.subscribe(this.resolve.bind(this));
    this.signals.commit.subscribe(this.commit.bind(this));
    this.signals.reset.subscribe(function() {
      this.setClass("full " + item);
    }.bind(this));
    this.received = undefined;
  }

  SinkR.prototype.push = function(dir, item, sender) {
    if (dir == Dir.right) {
      this.received = item;
    } else {
      this.signals.error.onNext();
    }
  }

  SinkR.prototype.resolve = function() {
      if (this.received && this.received != this.item) {
        // We've gotten an item we didn't want
        this.received = false;
        this.signals.error.onNext();
      }

      this.signals.resolveDone.onNext()
  }

  SinkR.prototype.commit = function() {
    if (this.received) {
      this.setClass("magic");
      this.signals.received.onNext();
    } else {
      this.setClass("");
    }

    this.received = false;
    this.signals.commitDone.onNext();
  }

  SinkR.prototype.render = function(root, svg, size) {
    dSrc = [
      ["M", size, size / 4],
      ["H", size * 3 / 4],
      ["A", size * 3 / 8, size * 3 / 8, 0, 1, 0, size * 3/4, size * 3/4],
      ["H", size],
      ["Z"]
    ];

    root.appendChild(svg("path", {d: dSrc.map(function(i){return i.join(" ")}).join(" "), class: "track"}));
    root.appendChild(svg("circle", {cx: size * 3 / 6, cy: size * 3 / 6, r: size/6, class: "box"}));
  }

  return SinkR;
});
