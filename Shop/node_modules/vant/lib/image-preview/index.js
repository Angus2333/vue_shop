"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _vue = require("vue");

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _utils = require("../utils");

var _mountComponent2 = require("../utils/mount-component");

var _ImagePreview = _interopRequireDefault(require("./ImagePreview"));

var instance;
var defaultConfig = {
  loop: true,
  images: [],
  maxZoom: 3,
  minZoom: 1 / 3,
  onScale: null,
  onClose: null,
  onChange: null,
  teleport: 'body',
  className: '',
  showIndex: true,
  closeable: false,
  closeIcon: 'clear',
  beforeClose: null,
  startPosition: 0,
  swipeDuration: 500,
  showIndicators: false,
  closeOnPopstate: true,
  closeIconPosition: 'top-right'
};

function initInstance() {
  var _mountComponent = (0, _mountComponent2.mountComponent)({
    setup: function setup() {
      var _usePopupState = (0, _mountComponent2.usePopupState)(),
          state = _usePopupState.state,
          toggle = _usePopupState.toggle;

      var onClosed = function onClosed() {
        state.images = [];
      };

      return function () {
        return (0, _vue.createVNode)(_ImagePreview.default, (0, _extends2.default)({}, state, {
          onClosed: onClosed,
          'onUpdate:show': toggle
        }), null);
      };
    }
  });

  instance = _mountComponent.instance;
}

var ImagePreview = function ImagePreview(images, startPosition) {
  if (startPosition === void 0) {
    startPosition = 0;
  }

  /* istanbul ignore if */
  if (!_utils.inBrowser) {
    return;
  }

  if (!instance) {
    initInstance();
  }

  var options = Array.isArray(images) ? {
    images: images,
    startPosition: startPosition
  } : images;
  instance.open((0, _extends2.default)({}, defaultConfig, options));
  return instance;
};

ImagePreview.Component = _ImagePreview.default;

ImagePreview.install = function (app) {
  app.use(_ImagePreview.default);
};

var _default = ImagePreview;
exports.default = _default;