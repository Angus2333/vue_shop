import { createVNode as _createVNode } from "vue";
import _extends from "@babel/runtime/helpers/esm/extends";
import { inBrowser } from '../utils';
import { mountComponent, usePopupState } from '../utils/mount-component';
import VanImagePreview from './ImagePreview';
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
  var _mountComponent = mountComponent({
    setup: function setup() {
      var _usePopupState = usePopupState(),
          state = _usePopupState.state,
          toggle = _usePopupState.toggle;

      var onClosed = function onClosed() {
        state.images = [];
      };

      return function () {
        return _createVNode(VanImagePreview, _extends({}, state, {
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
  if (!inBrowser) {
    return;
  }

  if (!instance) {
    initInstance();
  }

  var options = Array.isArray(images) ? {
    images: images,
    startPosition: startPosition
  } : images;
  instance.open(_extends({}, defaultConfig, options));
  return instance;
};

ImagePreview.Component = VanImagePreview;

ImagePreview.install = function (app) {
  app.use(VanImagePreview);
};

export default ImagePreview;