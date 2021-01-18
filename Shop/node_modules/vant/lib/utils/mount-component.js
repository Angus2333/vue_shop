"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.usePopupState = usePopupState;
exports.mountComponent = mountComponent;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _vue = require("vue");

var _useExpose = require("../composables/use-expose");

function usePopupState() {
  var state = (0, _vue.reactive)({
    show: false
  });

  var toggle = function toggle(show) {
    state.show = show;
  };

  var open = function open(props) {
    (0, _extends2.default)(state, props);
    (0, _vue.nextTick)(function () {
      toggle(true);
    });
  };

  var close = function close() {
    toggle(false);
  };

  (0, _useExpose.useExpose)({
    open: open,
    close: close,
    toggle: toggle
  });
  return {
    open: open,
    close: close,
    state: state,
    toggle: toggle
  };
}

function mountComponent(RootComponent) {
  var app = (0, _vue.createApp)(RootComponent);
  var root = document.createElement('div');
  document.body.appendChild(root);
  return {
    instance: app.mount(root),
    unmount: function unmount() {
      app.unmount(root);
      document.body.removeChild(root);
    }
  };
}