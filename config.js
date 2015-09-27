requirejs = require("requirejs");

requirejs.config({
  nodeRequire: require,
  baseUrl: "js",
  paths: {
    rx: "../node_modules/rx/dist/rx.lite"
  }
})

module.exports = requirejs
