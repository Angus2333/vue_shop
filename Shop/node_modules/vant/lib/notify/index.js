"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _vue = require("vue");

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _utils = require("../utils");

var _mountComponent2 = require("../utils/mount-component");

var _Notify = _interopRequireDefault(require("./Notify"));

var timer;
var instance;

function parseOptions(message) {
  return (0, _utils.isObject)(message) ? message : {
    message: message
  };
}

function initInstance() {
  var _mountComponent = (0, _mountComponent2.mountComponent)({
    setup: function setup() {
      var _usePopupState = (0, _mountComponent2.usePopupState)(),
          state = _usePopupState.state,
          toggle = _usePopupState.toggle;

      return function () {
        return (0, _vue.createVNode)(_Notify.default, (0, _extends2.default)({}, state, {
          'onUpdate:show': toggle
        }), null);
      };
    }
  });

  instance = _mountComponent.instance;
}

function Notify(options) {
  if (!_utils.inBrowser) {
    return;
  }

  if (!instance) {
    initInstance();
  }

  options = (0, _extends2.default)({}, Notify.currentOptions, parseOptions(options));
  instance.open(options);
  clearTimeout(timer);

  if (options.duration > 0) {
    timer = setTimeout(Notify.clear, options.duration);
  }

  return instance;
}

function defaultOptions() {
  return {
    type: 'danger',
    color: undefined,
    message: '',
    onClose: null,
    onClick: null,
    onOpened: null,
    duration: 3000,
    className: '',
    background: undefined
  };
}

Notify.clear = function () {
  if (instance) {
    instance.toggle(false);
  }
};

Notify.currentOptions = defaultOptions();

Notify.setDefaultOptions = function (options) {
  (0, _extends2.default)(Notify.currentOptions, options);
};

Notify.resetDefaultOptions = function () {
  Notify.currentOptions = defaultOptions();
};

Notify.install = function (app) {
  app.use(_Notify.default);
  app.config.globalProperties.$notify = Notify;
};

Notify.Component = _Notify.default;
var _default = Notify;
exports.default = _default;