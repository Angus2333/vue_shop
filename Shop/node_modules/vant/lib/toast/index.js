"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _vue = require("vue");

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _utils = require("../utils");

var _mountComponent2 = require("../utils/mount-component");

var _Toast = _interopRequireDefault(require("./Toast"));

var defaultOptions = {
  icon: '',
  type: 'text',
  message: '',
  className: '',
  overlay: false,
  onClose: null,
  onOpened: null,
  duration: 2000,
  teleport: 'body',
  iconPrefix: undefined,
  position: 'middle',
  transition: 'van-fade',
  forbidClick: false,
  loadingType: undefined,
  overlayStyle: null,
  closeOnClick: false,
  closeOnClickOverlay: false
}; // default options of specific type

var defaultOptionsMap = {};
var queue = [];
var allowMultiple = false;
var currentOptions = (0, _extends2.default)({}, defaultOptions);

function parseOptions(message) {
  if ((0, _utils.isObject)(message)) {
    return message;
  }

  return {
    message: message
  };
}

function createInstance() {
  var _mountComponent = (0, _mountComponent2.mountComponent)({
    setup: function setup() {
      var message = (0, _vue.ref)();

      var _usePopupState = (0, _mountComponent2.usePopupState)(),
          open = _usePopupState.open,
          state = _usePopupState.state,
          close = _usePopupState.close,
          toggle = _usePopupState.toggle;

      var onClosed = function onClosed() {
        if (allowMultiple) {
          queue = queue.filter(function (item) {
            return item !== instance;
          });
          unmount();
        }
      };

      (0, _vue.watch)(message, function (value) {
        state.message = value;
      });

      (0, _vue.getCurrentInstance)().render = function () {
        return (0, _vue.createVNode)(_Toast.default, (0, _extends2.default)({}, state, {
          onClosed: onClosed,
          'onUpdate:show': toggle
        }), null);
      };

      return {
        open: open,
        clear: close,
        message: message
      };
    }
  }),
      instance = _mountComponent.instance,
      unmount = _mountComponent.unmount;

  return instance;
}

function getInstance() {
  /* istanbul ignore if */
  if (!_utils.inBrowser) {
    return {};
  }

  if (!queue.length || allowMultiple) {
    var instance = createInstance();
    queue.push(instance);
  }

  return queue[queue.length - 1];
}

function Toast(options) {
  if (options === void 0) {
    options = {};
  }

  var toast = getInstance();
  options = parseOptions(options);
  options = (0, _extends2.default)({}, currentOptions, defaultOptionsMap[options.type || currentOptions.type], options);
  toast.open(options);
  return toast;
}

var createMethod = function createMethod(type) {
  return function (options) {
    return Toast((0, _extends2.default)({
      type: type
    }, parseOptions(options)));
  };
};

['loading', 'success', 'fail'].forEach(function (method) {
  Toast[method] = createMethod(method);
});

Toast.clear = function (all) {
  if (queue.length) {
    if (all) {
      queue.forEach(function (toast) {
        toast.clear();
      });
      queue = [];
    } else if (!allowMultiple) {
      queue[0].clear();
    } else {
      queue.shift().clear();
    }
  }
};

Toast.setDefaultOptions = function (type, options) {
  if (typeof type === 'string') {
    defaultOptionsMap[type] = options;
  } else {
    (0, _extends2.default)(currentOptions, type);
  }
};

Toast.resetDefaultOptions = function (type) {
  if (typeof type === 'string') {
    defaultOptionsMap[type] = null;
  } else {
    currentOptions = (0, _extends2.default)({}, defaultOptions);
    defaultOptionsMap = {};
  }
};

Toast.allowMultiple = function (value) {
  if (value === void 0) {
    value = true;
  }

  allowMultiple = value;
};

Toast.install = function (app) {
  app.use(_Toast.default);
  app.config.globalProperties.$toast = Toast;
};

var _default = Toast;
exports.default = _default;