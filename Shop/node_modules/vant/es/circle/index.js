import { isVNode as _isVNode } from "vue";
import { createVNode as _createVNode } from "vue";
import { watch, computed } from 'vue';
import { raf, cancelRaf } from '@vant/use';
import { isObject, getSizeStyle, createNamespace } from '../utils';

function _isSlot(s) {
  return typeof s === 'function' || Object.prototype.toString.call(s) === '[object Object]' && !_isVNode(s);
}

var _createNamespace = createNamespace('circle'),
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

export default createComponent({
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
    var viewBoxSize = computed(function () {
      return +props.strokeWidth + 1000;
    });
    var path = computed(function () {
      return getPath(props.clockwise, viewBoxSize.value);
    });
    watch(function () {
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
          rafId = raf(animate);
        }
      };

      if (props.speed) {
        if (rafId) {
          cancelRaf(rafId);
        }

        rafId = raf(animate);
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
      return _createVNode("path", {
        "d": path.value,
        "style": style,
        "class": bem('hover'),
        "stroke": isObject(color) ? "url(#" + id + ")" : color
      }, null);
    };

    var renderLayer = function renderLayer() {
      var style = {
        fill: props.fill,
        stroke: props.layerColor,
        strokeWidth: props.strokeWidth + "px"
      };
      return _createVNode("path", {
        "class": bem('layer'),
        "style": style,
        "d": path.value
      }, null);
    };

    var renderGradient = function renderGradient() {
      var color = props.color;

      if (!isObject(color)) {
        return;
      }

      var Stops = Object.keys(color).sort(function (a, b) {
        return parseFloat(a) - parseFloat(b);
      }).map(function (key, index) {
        return _createVNode("stop", {
          "key": index,
          "offset": key,
          "stop-color": color[key]
        }, null);
      });
      return _createVNode("defs", null, [_createVNode("linearGradient", {
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
        return _createVNode("div", {
          "class": bem('text')
        }, [props.text]);
      }
    };

    return function () {
      return _createVNode("div", {
        "class": bem(),
        "style": getSizeStyle(props.size)
      }, [_createVNode("svg", {
        "viewBox": "0 0 " + viewBoxSize.value + " " + viewBoxSize.value
      }, [renderGradient(), renderLayer(), renderHover()]), renderText()]);
    };
  }
});