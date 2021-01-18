"use strict";

exports.__esModule = true;
exports.default = void 0;

var _vue = require("vue");

var _use = require("@vant/use");

var _utils = require("../utils");

function _isSlot(s) {
  return typeof s === 'function' || Object.prototype.toString.call(s) === '[object Object]' && !(0, _vue.isVNode)(s);
}

var _createNamespace = (0, _utils.createNamespace)('circle'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

var uid = 0;

function format(rate) {
  return Math.min(Math.max(+rate, 0), 100);
}

function getPath(clockwise, viewBoxSize) {
  var sweepFlag = clockwise ? 1 : 0;
  return "M " + viewBoxSize / 2 + " " + viewBoxSize / 2 + " m 0, -500 a 500, 500 0 1, " + sweepFlag + " 0, 1000 a 500, 500 0 1, " + sweepFlag + " 0, -1000";
}

var _default2 = createComponent({
  props: {
    text: String,
    size: [Number, String],
    color: [String, Object],
    layerColor: String,
    strokeLinecap: String,
    currentRate: {
      type: Number,
      default: 0
    },
    speed: {
      type: [Number, String],
      default: 0
    },
    fill: {
      type: String,
      default: 'none'
    },
    rate: {
      type: [Number, String],
      default: 100
    },
    strokeWidth: {
      type: [Number, String],
      default: 40
    },
    clockwise: {
      type: Boolean,
      default: true
    }
  },
  emits: ['update:currentRate'],
  setup: function setup(props, _ref) {
    var emit = _ref.emit,
        slots = _ref.slots;
    var id = "van-circle-" + uid++;
    var viewBoxSize = (0, _vue.computed)(function () {
      return +props.strokeWidth + 1000;
    });
    var path = (0, _vue.computed)(function () {
      return getPath(props.clockwise, viewBoxSize.value);
    });
    (0, _vue.watch)(function () {
      return props.rate;
    }, function (rate) {
      var rafId;
      var startTime = Date.now();
      var startRate = props.currentRate;
      var endRate = format(rate);
      var duration = Math.abs((startRate - endRate) * 1000 / +props.speed);

      var animate = function animate() {
        var now = Date.now();
        var progress = Math.min((now - startTime) / duration, 1);
        var rate = progress * (endRate - startRate) + startRate;
        emit('update:currentRate', format(parseFloat(rate.toFixed(1))));

        if (endRate > startRate ? rate < endRate : rate > endRate) {
          rafId = (0, _use.raf)(animate);
        }
      };

      if (props.speed) {
        if (rafId) {
          (0, _use.cancelRaf)(rafId);
        }

        rafId = (0, _use.raf)(animate);
      } else {
        emit('update:currentRate', endRate);
      }
    }, {
      immediate: true
    });

    var renderHover = function renderHover() {
      var PERIMETER = 3140;
      var color = props.color,
          strokeWidth = props.strokeWidth,
          currentRate = props.currentRate,
          strokeLinecap = props.strokeLinecap;
      var offset = PERIMETER * currentRate / 100;
      var style = {
        stroke: "" + color,
        strokeWidth: +strokeWidth + 1 + "px",
        strokeLinecap: strokeLinecap,
        strokeDasharray: offset + "px " + PERIMETER + "px"
      };
      return (0, _vue.createVNode)("path", {
        "d": path.value,
        "style": style,
        "class": bem('hover'),
        "stroke": (0, _utils.isObject)(color) ? "url(#" + id + ")" : color
      }, null);
    };

    var renderLayer = function renderLayer() {
      var style = {
        fill: props.fill,
        stroke: props.layerColor,
        strokeWidth: props.strokeWidth + "px"
      };
      return (0, _vue.createVNode)("path", {
        "class": bem('layer'),
        "style": style,
        "d": path.value
      }, null);
    };

    var renderGradient = function renderGradient() {
      var color = props.color;

      if (!(0, _utils.isObject)(color)) {
        return;
      }

      var Stops = Object.keys(color).sort(function (a, b) {
        return parseFloat(a) - parseFloat(b);
      }).map(function (key, index) {
        return (0, _vue.createVNode)("stop", {
          "key": index,
          "offset": key,
          "stop-color": color[key]
        }, null);
      });
      return (0, _vue.createVNode)("defs", null, [(0, _vue.createVNode)("linearGradient", {
        "id": id,
        "x1": "100%",
        "y1": "0%",
        "x2": "0%",
        "y2": "0%"
      }, _isSlot(Stops) ? Stops : {
        default: function _default() {
          return [Stops];
        }
      })]);
    };

    var renderText = function renderText() {
      if (slots.default) {
        return slots.default();
      }

      if (props.text) {
        return (0, _vue.createVNode)("div", {
          "class": bem('text')
        }, [props.text]);
      }
    };

    return function () {
      return (0, _vue.createVNode)("div", {
        "class": bem(),
        "style": (0, _utils.getSizeStyle)(props.size)
      }, [(0, _vue.createVNode)("svg", {
        "viewBox": "0 0 " + viewBoxSize.value + " " + viewBoxSize.value
      }, [renderGradient(), renderLayer(), renderHover()]), renderText()]);
    };
  }
});

exports.default = _default2;