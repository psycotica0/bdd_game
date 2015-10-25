define(["cells/simple", "dir"], function(SimpleCell, Dir) {
  var EmitterR = function(signals) {
    SimpleCell.call(this, signals);
    this.items = 10;
    this.interval = 2;
    this.position = 0;
    this.signals.initial.subscribe(function() {
      this.setClass("magic");
    }.bind(this));
  }

  EmitterR.prototype = Object.create(SimpleCell.prototype);
  EmitterR.constructor = EmitterR;

  EmitterR.prototype.update = function() {
    if (this.position == 0 && this.items > 0) {
      this.right.push(Dir.left, "a", this);
      this.nextState.items = this.items - 1;
    }
    this.nextState.position = (this.position + 1) % this.interval;
    this.signals.updateDone.onNext();
  }

  EmitterR.prototype.rollback = function(dir) {
    delete this.nextState.position;
    SimpleCell.prototype.rollback.call(this);
  }

  EmitterR.prototype.commit = function() {
    if (this.nextState.hasOwnProperty('position')) {
      this.position = this.nextState.position;
    }
    if (this.nextState.hasOwnProperty('items')) {
      this.items = this.nextState.items;
    }

    SimpleCell.prototype.commit.call(this);

    if (this.position == 0 && this.items > 0) {
      this.setClass("magic");
    } else {
      this.setClass("");
    }
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
