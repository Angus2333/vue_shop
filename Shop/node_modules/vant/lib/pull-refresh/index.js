"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _vue = require("vue");

var _utils = require("../utils");

var _use = require("@vant/use");

var _useTouch = require("../composables/use-touch");

var _loading = _interopRequireDefault(require("../loading"));

// Utils
// Composition
// Components
function _isSlot(s) {
  return typeof s === 'function' || Object.prototype.toString.call(s) === '[object Object]' && !(0, _vue.isVNode)(s);
}

var _createNamespace = (0, _utils.createNamespace)('pull-refresh'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1],
    t = _createNamespace[2];

var DEFAULT_HEAD_HEIGHT = 50;
var TEXT_STATUS = ['pulling', 'loosing', 'success'];

var _default2 = createComponent({
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
    var root = (0, _vue.ref)();
    var scrollParent = (0, _use.useScrollParent)(root);
    var state = (0, _vue.reactive)({
      status: 'normal',
      distance: 0,
      duration: 0
    });
    var touch = (0, _useTouch.useTouch)();

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
        nodes.push((0, _vue.createVNode)("div", {
          "class": bem('text')
        }, [getStatusText()]));
      }

      if (status === 'loading') {
        var _slot;

        nodes.push((0, _vue.createVNode)(_loading.default, {
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
      reachTop = (0, _utils.getScrollTop)(scrollParent.value) === 0;

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
          (0, _utils.preventDefault)(event);
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

          (0, _vue.nextTick)(function () {
            emit('refresh');
          });
        } else {
          setStatus(0);
        }
      }
    };

    (0, _vue.watch)(function () {
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
      return (0, _vue.createVNode)("div", {
        "ref": root,
        "class": bem()
      }, [(0, _vue.createVNode)("div", {
        "class": bem('track'),
        "style": trackStyle,
        "onTouchstart": onTouchStart,
        "onTouchmove": onTouchMove,
        "onTouchend": onTouchEnd,
        "onTouchcancel": onTouchEnd
      }, [(0, _vue.createVNode)("div", {
        "class": bem('head'),
        "style": getHeadStyle()
      }, [renderStatus()]), slots.default == null ? void 0 : slots.default()])]);
    };
  }
});

exports.default = _default2;