"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _vue = require("vue");

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _utils = require("../utils");

var _mountComponent2 = require("../utils/mount-component");

var _Dialog = _interopRequireDefault(require("./Dialog"));

var instance;

function initInstance() {
  var Wrapper = {
    setup: function setup() {
      var _usePopupState = (0, _mountComponent2.usePopupState)(),
          state = _usePopupState.state,
          toggle = _usePopupState.toggle;

      return function () {
        return (0, _vue.createVNode)(_Dialog.default, (0, _extends2.default)({}, state, {
          'onUpdate:show': toggle
        }), null);
      };
    }
  };

  var _mountComponent = (0, _mountComponent2.mountComponent)(Wrapper);

  instance = _mountComponent.instance;
}

function Dialog(options) {
  /* istanbul ignore if */
  if (!_utils.inBrowser) {
    return Promise.resolve();
  }

  return new Promise(function (resolve, reject) {
    if (!instance) {
      initInstance();
    }

    instance.open((0, _extends2.default)({}, Dialog.currentOptions, options, {
      callback: function callback(action) {
        (action === 'confirm' ? resolve : reject)(action);
      }
    }));
  });
}

Dialog.defaultOptions = {
  title: '',
  width: '',
  theme: null,
  message: '',
  overlay: true,
  callback: null,
  teleport: 'body',
  className: '',
  allowHtml: false,
  lockScroll: true,
  transition: 'van-dialog-bounce',
  beforeClose: null,
  overlayClass: '',
  overlayStyle: null,
  messageAlign: '',
  cancelButtonText: '',
  cancelButtonColor: null,
  confirmButtonText: '',
  confirmButtonColor: null,
  showConfirmButton: true,
  showCancelButton: false,
  closeOnPopstate: true,
  closeOnClickOverlay: false
};
Dialog.alert = Dialog;

Dialog.confirm = function (options) {
  return Dialog((0, _extends2.default)({
    showCancelButton: true
  }, options));
};

Dialog.close = function () {
  if (instance) {
    instance.toggle(false);
  }
};

Dialog.setDefaultOptions = function (options) {
  (0, _extends2.default)(Dialog.currentOptions, options);
};

Dialog.resetDefaultOptions = function () {
  Dialog.currentOptions = (0, _extends2.default)({}, Dialog.defaultOptions);
};

Dialog.resetDefaultOptions();

Dialog.install = function (app) {
  app.use(_Dialog.default);
  app.config.globalProperties.$dialog = Dialog;
};

Dialog.Component = _Dialog.default;
var _default = Dialog;
exports.default = _default;