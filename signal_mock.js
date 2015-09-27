var Rx = requirejs("rx");

module.exports = function() {
  return {
    update: new Rx.Subject(),
    updateDone: new Rx.Subject(),
    resolve: new Rx.Subject(),
    resolveDone: new Rx.Subject(),
    commit: new Rx.Subject(),
    error: new Rx.Subject(),
  }
};
