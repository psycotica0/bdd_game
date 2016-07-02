define(["lodash", "dir", "rx", "rx.custom"], function(_, Dir, Rx) {
  var EmitterR = function(signals, item) {
    this.signals = signals;
    this.item = item
    this.dispose = [];
    var haveItems = function() {
      return (this.items.length > 0);
    }.bind(this);

    this.signals.reset.subscribe(function() {
      this.nextItems = undefined;
      this.items = _.times(10, _.constant(this.item))
      this.interval = 2;

      // Start off about to emit
      if (this.active)
        this.setClass("magic full " + this.item);
      else
        this.setClass("");

      // Dispose of old signals
      this.dispose.forEach(function(s) {
        s.dispose();
      });
      this.dispose = [];

      // If we're not active, don't subscribe to any of these
      if (!this.active)
        return;

      // This fires something out every interval updates, until there are none
      // left
      this.dispose.push(this.signals.update.
        tally().
        downsample(this.interval).
        takeWhile(haveItems).
        subscribe(function() {
          this.right.push(Dir.left, _.head(this.items), this);
          this.nextItems = _.tail(this.items);
          this.signals.updateDone.onNext();
        }.bind(this)));

      // This commits the changes and clears the magic state
      this.dispose.push(this.signals.commit.
        tally().
        downsample(this.interval).
        takeWhile(haveItems).
        subscribe(function () {
          if (this.nextItems) {
            this.items = this.nextItems;
          }
          this.setClass("");
          this.signals.commitDone.onNext();
        }.bind(this)));

      // This sets the magic state before each update
      this.dispose.push(this.signals.commit.
        tally().
        succ().
        downsample(this.interval).
        skip(1).
        takeWhile(haveItems).
        subscribe(function () {
          this.setClass("magic");
        }.bind(this)));
    }.bind(this));
  }

  EmitterR.prototype.rollback = function(dir) {
    this.nextItems = undefined;
  }

  EmitterR.prototype.render = function(root, svg, size) {
    dSrc = [
      ["M", 0, 0],
      ["A", size, size * 1/4, 0, 0, 0, size, size/4],
      ["V", size * 3/ 4],
      ["A", size, size / 4, 0, 0, 0, 0, size],
      ["Z"]
    ];
    root.appendChild(svg("path", {d: dSrc.map(function(i){return i.join(" ")}).join(" "), class: "track"}));
    root.appendChild(svg("circle", {cx: size * 2 / 6, cy: size * 3 / 6, r: size/6, class: "box"}));
  }

  return EmitterR;
});
