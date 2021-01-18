import { isVNode as _isVNode } from "vue";
import { createVNode as _createVNode } from "vue";
import { ref, watch, reactive, nextTick } from 'vue'; // Utils

import { preventDefault, getScrollTop, createNamespace } from '../utils'; // Composition

import { useScrollParent } from '@vant/use';
import { useTouch } from '../composables/use-touch'; // Components

import Loading from '../loading';

function _isSlot(s) {
  return typeof s === 'function' || Object.prototype.toString.call(s) === '[object Object]' && !_isVNode(s);
}

var _createNamespace = createNamespace('pull-refresh'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1],
    t = _createNamespace[2];

var DEFAULT_HEAD_HEIGHT = 50;
var TEXT_STATUS = ['pulling', 'loosing', 'success'];
export default createComponent({
  props: {
    disabled: Boolean,
    successText: String,
    pullingText: String,
    loosingText: String,
    loadingText: String,
    modelValue: {
      type: Boolean,
      required: true
    },
    successDuration: {
      type: [Number, String],
      default: 500
    },
    animationDuration: {
      type: [Number, String],
      default: 300
    },
    headHeight: {
      type: [Number, String],
      default: DEFAULT_HEAD_HEIGHT
    }
  },
  emits: ['refresh', 'update:modelValue'],
  setup: function setup(props, _ref) {
    var emit = _ref.emit,
        slots = _ref.slots;
    var reachTop;
    var root = ref();
    var scrollParent = useScrollParent(root);
    var state = reactive({
      status: 'normal',
      distance: 0,
      duration: 0
    });
    var touch = useTouch();

    var getHeadStyle = function getHeadStyle() {
      if (props.headHeight !== DEFAULT_HEAD_HEIGHT) {
        return {
          height: props.headHeight + "px"
        };
      }
    };

    var isTouchable = function isTouchable() {
      return state.status !== 'loading' && state.status !== 'success' && !props.disabled;
    };

    var ease = function ease(distance) {
      var headHeight = +props.headHeight;

      if (distance > headHeight) {
        if (distance < headHeight * 2) {
          distance = headHeight + (distance - headHeight) / 2;
        } else {
          distance = headHeight * 1.5 + (distance - headHeight * 2) / 4;
        }
      }

      return Math.round(distance);
    };

    var setStatus = function setStatus(distance, isLoading) {
      state.distance = distance;

      if (isLoading) {
        state.status = 'loading';
      } else if (distance === 0) {
        state.status = 'normal';
      } else if (distance < props.headHeight) {
        state.status = 'pulling';
      } else {
        state.status = 'loosing';
      }
    };

    var getStatusText = function getStatusText() {
      var status = state.status;

      if (status === 'normal') {
        return '';
      }

      return props[status + "Text"] || t(status);
    };

    var renderStatus = function renderStatus() {
      var status = state.status,
          distance = state.distance;

      if (slots[status]) {
        return slots[status]({
          distance: distance
        });
      }

      var nodes = [];

      if (TEXT_STATUS.indexOf(status) !== -1) {
        nodes.push(_createVNode("div", {
          "class": bem('text')
        }, [getStatusText()]));
      }

      if (status === 'loading') {
        var _slot;

        nodes.push(_createVNode(Loading, {
          "size": "16"
        }, _isSlot(_slot = getStatusText()) ? _slot : {
          default: function _default() {
            return [_slot];
          }
        }));
      }

      return nodes;
    };

    var showSuccessTip = function showSuccessTip() {
      state.status = 'success';
      setTimeout(function () {
        setStatus(0);
      }, +props.successDuration);
    };

    var checkPosition = function checkPosition(event) {
      reachTop = getScrollTop(scrollParent.value) === 0;

      if (reachTop) {
        state.duration = 0;
        touch.start(event);
      }
    };

    var onTouchStart = function onTouchStart(event) {
      if (isTouchable()) {
        checkPosition(event);
      }
    };

    var onTouchMove = function onTouchMove(event) {
      if (isTouchable()) {
        if (!reachTop) {
          checkPosition(event);
        }

        var deltaY = touch.deltaY;
        touch.move(event);

        if (reachTop && deltaY.value >= 0 && touch.isVertical()) {
          preventDefault(event);
          setStatus(ease(deltaY.value));
        }
      }
    };

    var onTouchEnd = function onTouchEnd() {
      if (reachTop && touch.deltaY.value && isTouchable()) {
        state.duration = +props.animationDuration;

        if (state.status === 'loosing') {
          setStatus(+props.headHeight, true);
          emit('update:modelValue', true); // ensure value change can be watched

          nextTick(function () {
            emit('refresh');
          });
        } else {
          setStatus(0);
        }
      }
    };

    watch(function () {
      return props.modelValue;
    }, function (value) {
      state.duration = +props.animationDuration;

      if (value) {
        setStatus(+props.headHeight, true);
      } else if (slots.success || props.successText) {
        showSuccessTip();
      } else {
        setStatus(0, false);
      }
    });
    return function () {
      var trackStyle = {
        transitionDuration: state.duration + "ms",
        transform: state.distance ? "translate3d(0," + state.distance + "px, 0)" : ''
      };
      return _createVNode("div", {
        "ref": root,
        "class": bem()
      }, [_createVNode("div", {
        "class": bem('track'),
        "style": trackStyle,
        "onTouchstart": onTouchStart,
        "onTouchmove": onTouchMove,
        "onTouchend": onTouchEnd,
        "onTouchcancel": onTouchEnd
      }, [_createVNode("div", {
        "class": bem('head'),
        "style": getHeadStyle()
      }, [renderStatus()]), slots.default == null ? void 0 : slots.default()])]);
    };
  }
});