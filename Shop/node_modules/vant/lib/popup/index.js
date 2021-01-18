"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = exports.popupSharedProps = void 0;

var _vue = require("vue");

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _utils = require("../utils");

var _use = require("@vant/use");

var _useExpose = require("../composables/use-expose");

var _useLockScroll2 = require("../composables/use-lock-scroll");

var _useLazyRender = require("../composables/use-lazy-render");

var _icon = _interopRequireDefault(require("../icon"));

var _overlay = _interopRequireDefault(require("../overlay"));

// Utils
// Composition
// Components
function _isSlot(s) {
  return typeof s === 'function' || Object.prototype.toString.call(s) === '[object Object]' && !(0, _vue.isVNode)(s);
}

var _createNamespace = (0, _utils.createNamespace)('popup'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

var context = {
  zIndex: 2000,
  lockCount: 0,
  stack: [],
  find: function find(vm) {
    return this.stack.filter(function (item) {
      return item.vm === vm;
    })[0];
  }
};
var popupSharedProps = {
  // whether to show popup
  show: Boolean,
  // z-index
  zIndex: [Number, String],
  // transition duration
  duration: [Number, String],
  // teleport
  teleport: [String, Object],
  // overlay custom style
  overlayStyle: Object,
  // overlay custom class name
  overlayClass: String,
  // Initial rendering animation
  transitionAppear: Boolean,
  // whether to show overlay
  overlay: {
    type: Boolean,
    default: true
  },
  // prevent body scroll
  lockScroll: {
    type: Boolean,
    default: true
  },
  // whether to lazy render
  lazyRender: {
    type: Boolean,
    default: true
  },
  // whether to close popup when overlay is clicked
  closeOnClickOverlay: {
    type: Boolean,
    default: true
  }
};
exports.popupSharedProps = popupSharedProps;

var _default2 = createComponent({
  inheritAttrs: false,
  props: (0, _extends2.default)({}, popupSharedProps, {
    round: Boolean,
    closeable: Boolean,
    transition: String,
    closeOnPopstate: Boolean,
    safeAreaInsetBottom: Boolean,
    position: {
      type: String,
      default: 'center'
    },
    closeIcon: {
      type: String,
      default: 'cross'
    },
    closeIconPosition: {
      type: String,
      default: 'top-right'
    }
  }),
  emits: ['open', 'close', 'click', 'opened', 'closed', 'update:show', 'click-overlay', 'click-close-icon'],
  setup: function setup(props, _ref) {
    var emit = _ref.emit,
        attrs = _ref.attrs,
        slots = _ref.slots;
    var opened;
    var shouldReopen;
    var zIndex = (0, _vue.ref)();
    var popupRef = (0, _vue.ref)();

    var _useLockScroll = (0, _useLockScroll2.useLockScroll)(popupRef, function () {
      return props.lockScroll;
    }),
        lockScroll = _useLockScroll[0],
        unlockScroll = _useLockScroll[1];

    var lazyRender = (0, _useLazyRender.useLazyRender)(function () {
      return props.show || !props.lazyRender;
    });
    var style = (0, _vue.computed)(function () {
      var style = {
        zIndex: zIndex.value
      };

      if ((0, _utils.isDef)(props.duration)) {
        var key = props.position === 'center' ? 'animationDuration' : 'transitionDuration';
        style[key] = props.duration + "s";
      }

      return style;
    });

    var open = function open() {
      if (!opened) {
        if (props.zIndex !== undefined) {
          context.zIndex = props.zIndex;
        }

        opened = true;
        lockScroll();
        zIndex.value = ++context.zIndex;
      }
    };

    var close = function close() {
      if (opened) {
        opened = false;
        unlockScroll();
        emit('update:show', false);
      }
    };

    var onClickOverlay = function onClickOverlay() {
      emit('click-overlay');

      if (props.closeOnClickOverlay) {
        close();
      }
    };

    var renderOverlay = function renderOverlay() {
      if (props.overlay) {
        return (0, _vue.createVNode)(_overlay.default, {
          "show": props.show,
          "class": props.overlayClass,
          "style": props.overlayStyle,
          "zIndex": zIndex.value,
          "duration": props.duration,
          "onClick": onClickOverlay
        }, null);
      }
    };

    var onClickCloseIcon = function onClickCloseIcon(event) {
      emit('click-close-icon', event);
      close();
    };

    var renderCloseIcon = function renderCloseIcon() {
      if (props.closeable) {
        return (0, _vue.createVNode)(_icon.default, {
          "role": "button",
          "tabindex": "0",
          "name": props.closeIcon,
          "class": bem('close-icon', props.closeIconPosition),
          "onClick": onClickCloseIcon
        }, null);
      }
    };

    var onClick = function onClick(event) {
      return emit('click', event);
    };

    var onOpened = function onOpened() {
      return emit('opened');
    };

    var onClosed = function onClosed() {
      return emit('closed');
    };

    var renderPopup = lazyRender(function () {
      var _bem;

      var round = props.round,
          position = props.position,
          safeAreaInsetBottom = props.safeAreaInsetBottom;
      return (0, _vue.withDirectives)((0, _vue.createVNode)("div", (0, _vue.mergeProps)({
        "ref": popupRef,
        "style": style.value,
        "class": bem((_bem = {
          round: round
        }, _bem[position] = position, _bem['safe-area-inset-bottom'] = safeAreaInsetBottom, _bem)),
        "onClick": onClick
      }, attrs), [slots.default == null ? void 0 : slots.default(), renderCloseIcon()]), [[_vue.vShow, props.show]]);
    });

    var renderTransition = function renderTransition() {
      var _slot;

      var position = props.position,
          transition = props.transition,
          transitionAppear = props.transitionAppear;
      var name = position === 'center' ? 'van-fade' : "van-popup-slide-" + position;
      return (0, _vue.createVNode)(_vue.Transition, {
        "name": transition || name,
        "appear": transitionAppear,
        "onAfterEnter": onOpened,
        "onAfterLeave": onClosed
      }, _isSlot(_slot = renderPopup()) ? _slot : {
        default: function _default() {
          return [_slot];
        }
      });
    };

    (0, _vue.watch)(function () {
      return props.show;
    }, function (value) {
      if (value) {
        open();
        emit('open');
      } else {
        close();
        emit('close');
      }
    });
    (0, _useExpose.useExpose)({
      popupRef: popupRef
    });
    (0, _use.useEventListener)('popstate', function () {
      if (props.closeOnPopstate) {
        close();
        shouldReopen = false;
      }
    });
    (0, _vue.onMounted)(function () {
      if (props.show) {
        open();
      }
    });
    (0, _vue.onActivated)(function () {
      if (shouldReopen) {
        emit('update:show', true);
        shouldReopen = false;
      }
    });
    (0, _vue.onDeactivated)(function () {
      if (props.show) {
        close();
        shouldReopen = true;
      }
    });
    (0, _vue.onBeforeUnmount)(function () {
      if (opened) {
        unlockScroll();
      }
    });
    return function () {
      if (props.teleport) {
        return (0, _vue.createVNode)(_vue.Teleport, {
          "to": props.teleport
        }, {
          default: function _default() {
            return [renderOverlay(), renderTransition()];
          }
        });
      }

      return (0, _vue.createVNode)(_vue.Fragment, null, [renderOverlay(), renderTransition()]);
    };
  }
});

exports.default = _default2;