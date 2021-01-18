import { Fragment as _Fragment } from "vue";
import { isVNode as _isVNode } from "vue";
import { withDirectives as _withDirectives } from "vue";
import { mergeProps as _mergeProps } from "vue";
import { vShow as _vShow } from "vue";
import { createVNode as _createVNode } from "vue";
import _extends from "@babel/runtime/helpers/esm/extends";
// Utils
import { ref, watch, Teleport, computed, onMounted, Transition, onActivated, onDeactivated, onBeforeUnmount } from 'vue';
import { createNamespace, isDef } from '../utils'; // Composition

import { useEventListener } from '@vant/use';
import { useExpose } from '../composables/use-expose';
import { useLockScroll } from '../composables/use-lock-scroll';
import { useLazyRender } from '../composables/use-lazy-render'; // Components

import Icon from '../icon';
import Overlay from '../overlay';

function _isSlot(s) {
  return typeof s === 'function' || Object.prototype.toString.call(s) === '[object Object]' && !_isVNode(s);
}

var _createNamespace = createNamespace('popup'),
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
export var popupSharedProps = {
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
export default createComponent({
  inheritAttrs: false,
  props: _extends({}, popupSharedProps, {
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
    var zIndex = ref();
    var popupRef = ref();

    var _useLockScroll = useLockScroll(popupRef, function () {
      return props.lockScroll;
    }),
        lockScroll = _useLockScroll[0],
        unlockScroll = _useLockScroll[1];

    var lazyRender = useLazyRender(function () {
      return props.show || !props.lazyRender;
    });
    var style = computed(function () {
      var style = {
        zIndex: zIndex.value
      };

      if (isDef(props.duration)) {
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
        return _createVNode(Overlay, {
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
        return _createVNode(Icon, {
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
      return _withDirectives(_createVNode("div", _mergeProps({
        "ref": popupRef,
        "style": style.value,
        "class": bem((_bem = {
          round: round
        }, _bem[position] = position, _bem['safe-area-inset-bottom'] = safeAreaInsetBottom, _bem)),
        "onClick": onClick
      }, attrs), [slots.default == null ? void 0 : slots.default(), renderCloseIcon()]), [[_vShow, props.show]]);
    });

    var renderTransition = function renderTransition() {
      var _slot;

      var position = props.position,
          transition = props.transition,
          transitionAppear = props.transitionAppear;
      var name = position === 'center' ? 'van-fade' : "van-popup-slide-" + position;
      return _createVNode(Transition, {
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

    watch(function () {
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
    useExpose({
      popupRef: popupRef
    });
    useEventListener('popstate', function () {
      if (props.closeOnPopstate) {
        close();
        shouldReopen = false;
      }
    });
    onMounted(function () {
      if (props.show) {
        open();
      }
    });
    onActivated(function () {
      if (shouldReopen) {
        emit('update:show', true);
        shouldReopen = false;
      }
    });
    onDeactivated(function () {
      if (props.show) {
        close();
        shouldReopen = true;
      }
    });
    onBeforeUnmount(function () {
      if (opened) {
        unlockScroll();
      }
    });
    return function () {
      if (props.teleport) {
        return _createVNode(Teleport, {
          "to": props.teleport
        }, {
          default: function _default() {
            return [renderOverlay(), renderTransition()];
          }
        });
      }

      return _createVNode(_Fragment, null, [renderOverlay(), renderTransition()]);
    };
  }
});