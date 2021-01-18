"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _vue = require("vue");

var _shared = require("./shared");

var _interceptor = require("../utils/interceptor");

var _use = require("@vant/use");

var _useExpose = require("../composables/use-expose");

var _icon = _interopRequireDefault(require("../icon"));

var _swipe = _interopRequireDefault(require("../swipe"));

var _popup = _interopRequireDefault(require("../popup"));

var _ImagePreviewItem = _interopRequireDefault(require("./ImagePreviewItem"));

// Utils
// Composition
// Components
function _isSlot(s) {
  return typeof s === 'function' || Object.prototype.toString.call(s) === '[object Object]' && !(0, _vue.isVNode)(s);
}

var _default2 = (0, _shared.createComponent)({
  props: {
    show: Boolean,
    className: null,
    closeable: Boolean,
    beforeClose: Function,
    showIndicators: Boolean,
    images: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    loop: {
      type: Boolean,
      default: true
    },
    overlay: {
      type: Boolean,
      default: true
    },
    minZoom: {
      type: [Number, String],
      default: 1 / 3
    },
    maxZoom: {
      type: [Number, String],
      default: 3
    },
    showIndex: {
      type: Boolean,
      default: true
    },
    swipeDuration: {
      type: [Number, String],
      default: 500
    },
    startPosition: {
      type: [Number, String],
      default: 0
    },
    closeIcon: {
      type: String,
      default: 'clear'
    },
    closeOnPopstate: {
      type: Boolean,
      default: true
    },
    closeIconPosition: {
      type: String,
      default: 'top-right'
    }
  },
  emits: ['scale', 'close', 'closed', 'change', 'update:show'],
  setup: function setup(props, _ref) {
    var emit = _ref.emit,
        slots = _ref.slots;
    var swipeRef = (0, _vue.ref)();
    var windowSize = (0, _use.useWindowSize)();
    var state = (0, _vue.reactive)({
      active: 0,
      rootWidth: 0,
      rootHeight: 0
    });

    var resize = function resize() {
      if (swipeRef.value) {
        var rect = swipeRef.value.$el.getBoundingClientRect();
        state.rootWidth = rect.width;
        state.rootHeight = rect.height;
      }
    };

    var emitScale = function emitScale(args) {
      emit('scale', args);
    };

    var emitClose = function emitClose() {
      (0, _interceptor.callInterceptor)({
        interceptor: props.beforeClose,
        args: [state.active],
        done: function done() {
          emit('update:show', false);
        }
      });
    };

    var setActive = function setActive(active) {
      if (active !== state.active) {
        state.active = active;
        emit('change', active);
      }
    };

    var renderIndex = function renderIndex() {
      if (props.showIndex) {
        return (0, _vue.createVNode)("div", {
          "class": (0, _shared.bem)('index')
        }, [slots.index ? slots.index({
          index: state.active
        }) : state.active + 1 + " / " + props.images.length]);
      }
    };

    var renderCover = function renderCover() {
      if (slots.cover) {
        return (0, _vue.createVNode)("div", {
          "class": (0, _shared.bem)('cover')
        }, [slots.cover()]);
      }
    };

    var renderImages = function renderImages() {
      var _slot;

      return (0, _vue.createVNode)(_swipe.default, {
        "ref": swipeRef,
        "lazyRender": true,
        "loop": props.loop,
        "class": (0, _shared.bem)('swipe'),
        "duration": props.swipeDuration,
        "initialSwipe": props.startPosition,
        "showIndicators": props.showIndicators,
        "indicatorColor": "white",
        "onChange": setActive
      }, _isSlot(_slot = props.images.map(function (image) {
        return (0, _vue.createVNode)(_ImagePreviewItem.default, {
          "src": image,
          "show": props.show,
          "active": state.active,
          "maxZoom": props.maxZoom,
          "minZoom": props.minZoom,
          "rootWidth": state.rootWidth,
          "rootHeight": state.rootHeight,
          "onScale": emitScale,
          "onClose": emitClose
        }, null);
      })) ? _slot : {
        default: function _default() {
          return [_slot];
        }
      });
    };

    var renderClose = function renderClose() {
      if (props.closeable) {
        return (0, _vue.createVNode)(_icon.default, {
          "role": "button",
          "name": props.closeIcon,
          "class": (0, _shared.bem)('close-icon', props.closeIconPosition),
          "onClick": emitClose
        }, null);
      }
    };

    var onClosed = function onClosed() {
      emit('closed');
    };

    var swipeTo = function swipeTo(index, options) {
      if (swipeRef.value) {
        swipeRef.value.swipeTo(index, options);
      }
    };

    (0, _useExpose.useExpose)({
      swipeTo: swipeTo
    });
    (0, _vue.onMounted)(resize);
    (0, _vue.watch)([windowSize.width, windowSize.height], resize);
    (0, _vue.watch)(function () {
      return props.startPosition;
    }, setActive);
    (0, _vue.watch)(function () {
      return props.show;
    }, function (value) {
      var images = props.images,
          startPosition = props.startPosition;

      if (value) {
        setActive(+startPosition);
        (0, _vue.nextTick)(function () {
          resize();
          swipeTo(+startPosition, {
            immediate: true
          });
        });
      } else {
        emit('close', {
          index: state.active,
          url: images[state.active]
        });
      }
    });
    return function () {
      return (0, _vue.createVNode)(_popup.default, {
        "show": props.show,
        "class": [(0, _shared.bem)(), props.className],
        "overlayClass": (0, _shared.bem)('overlay'),
        "closeOnPopstate": props.closeOnPopstate,
        "onClosed": onClosed
      }, {
        default: function _default() {
          return [renderClose(), renderImages(), renderIndex(), renderCover()];
        }
      });
    };
  }
});

exports.default = _default2;