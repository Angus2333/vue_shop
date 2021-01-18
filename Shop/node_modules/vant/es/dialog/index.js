import { createVNode as _createVNode } from "vue";
import _extends from "@babel/runtime/helpers/esm/extends";
import { inBrowser } from '../utils';
import { mountComponent, usePopupState } from '../utils/mount-component';
import VanDialog from './Dialog';
var instance;

function initInstance() {
  var Wrapper = {
    setup: function setup() {
      var _usePopupState = usePopupState(),
          state = _usePopupState.state,
          toggle = _usePopupState.toggle;

      return function () {
        return _createVNode(VanDialog, _extends({}, state, {
          'onUpdate:show': toggle
        }), null);
      };
    }
  };

  var _mountComponent = mountComponent(Wrapper);

  instance = _mountComponent.instance;
}

function Dialog(options) {
  /* istanbul ignore if */
  if (!inBrowser) {
    return Promise.resolve();
  }

  return new Promise(function (resolve, reject) {
    if (!instance) {
      initInstance();
    }

    instance.open(_extends({}, Dialog.currentOptions, options, {
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
  return Dialog(_extends({
    showCancelButton: true
  }, options));
};

Dialog.close = function () {
  if (instance) {
    instance.toggle(false);
  }
};

Dialog.setDefaultOptions = function (options) {
  _extends(Dialog.currentOptions, options);
};

Dialog.resetDefaultOptions = function () {
  Dialog.currentOptions = _extends({}, Dialog.defaultOptions);
};

Dialog.resetDefaultOptions();

Dialog.install = function (app) {
  app.use(VanDialog);
  app.config.globalProperties.$dialog = Dialog;
};

Dialog.Component = VanDialog;
export default Dialog;