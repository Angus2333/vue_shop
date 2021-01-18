import { createVNode as _createVNode } from "vue";
import _extends from "@babel/runtime/helpers/esm/extends";
import { ref, watch, getCurrentInstance } from 'vue';
import { isObject, inBrowser } from '../utils';
import { mountComponent, usePopupState } from '../utils/mount-component';
import VanToast from './Toast';
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

var currentOptions = _extends({}, defaultOptions);

function parseOptions(message) {
  if (isObject(message)) {
    return message;
  }

  return {
    message: message
  };
}

function createInstance() {
  var _mountComponent = mountComponent({
    setup: function setup() {
      var message = ref();

      var _usePopupState = usePopupState(),
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

      watch(message, function (value) {
        state.message = value;
      });

      getCurrentInstance().render = function () {
        return _createVNode(VanToast, _extends({}, state, {
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
  if (!inBrowser) {
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
  options = _extends({}, currentOptions, defaultOptionsMap[options.type || currentOptions.type], options);
  toast.open(options);
  return toast;
}

var createMethod = function createMethod(type) {
  return function (options) {
    return Toast(_extends({
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
    _extends(currentOptions, type);
  }
};

Toast.resetDefaultOptions = function (type) {
  if (typeof type === 'string') {
    defaultOptionsMap[type] = null;
  } else {
    currentOptions = _extends({}, defaultOptions);
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
  app.use(VanToast);
  app.config.globalProperties.$toast = Toast;
};

export default Toast;