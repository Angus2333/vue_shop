import { createVNode as _createVNode } from "vue";
import _extends from "@babel/runtime/helpers/esm/extends";
import { isObject, inBrowser } from '../utils';
import { mountComponent, usePopupState } from '../utils/mount-component';
import VanNotify from './Notify';
var timer;
var instance;

function parseOptions(message) {
  return isObject(message) ? message : {
    message: message
  };
}

function initInstance() {
  var _mountComponent = mountComponent({
    setup: function setup() {
      var _usePopupState = usePopupState(),
          state = _usePopupState.state,
          toggle = _usePopupState.toggle;

      return function () {
        return _createVNode(VanNotify, _extends({}, state, {
          'onUpdate:show': toggle
        }), null);
      };
    }
  });

  instance = _mountComponent.instance;
}

function Notify(options) {
  if (!inBrowser) {
    return;
  }

  if (!instance) {
    initInstance();
  }

  options = _extends({}, Notify.currentOptions, parseOptions(options));
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
  _extends(Notify.currentOptions, options);
};

Notify.resetDefaultOptions = function () {
  Notify.currentOptions = defaultOptions();
};

Notify.install = function (app) {
  app.use(VanNotify);
  app.config.globalProperties.$notify = Notify;
};

Notify.Component = VanNotify;
export default Notify;