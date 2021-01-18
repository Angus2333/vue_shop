"use strict";

exports.__esModule = true;
exports.default = void 0;

var _vue = require("vue");

var _utils = require("../utils");

var _utils2 = require("./utils");

var _use = require("@vant/use");

var _useExpose = require("../composables/use-expose");

// Utils
// Composition
var _createNamespace = (0, _utils.createNamespace)('count-down'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

var _default = createComponent({
  props: {
    millisecond: Boolean,
    time: {
      type: [Number, String],
      default: 0
    },
    format: {
      type: String,
      default: 'HH:mm:ss'
    },
    autoStart: {
      type: Boolean,
      default: true
    }
  },
  emits: ['change', 'finish'],
  setup: function setup(props, _ref) {
    var emit = _ref.emit,
        slots = _ref.slots;

    var _useCountDown = (0, _use.useCountDown)({
      time: +props.time,
      millisecond: props.millisecond,
      onChange: function onChange(current) {
        emit('change', current);
      },
      onFinish: function onFinish() {
        emit('finish');
      }
    }),
        start = _useCountDown.start,
        pause = _useCountDown.pause,
        reset = _useCountDown.reset,
        current = _useCountDown.current;

    var timeText = (0, _vue.computed)(function () {
      return (0, _utils2.parseFormat)(props.format, current.value);
    });

    var resetTime = function resetTime() {
      reset(+props.time);

      if (props.autoStart) {
        start();
      }
    };

    (0, _vue.watch)(function () {
      return props.time;
    }, resetTime, {
      immediate: true
    });
    (0, _useExpose.useExpose)({
      start: start,
      pause: pause,
      reset: resetTime
    });
    return function () {
      return (0, _vue.createVNode)("div", {
        "class": bem()
      }, [slots.default ? slots.default(current.value) : timeText.value]);
    };
  }
});

exports.default = _default;