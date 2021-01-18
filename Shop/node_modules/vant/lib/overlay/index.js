"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _vue = require("vue");

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _utils = require("../utils");

var _useLazyRender = require("../composables/use-lazy-render");

function _isSlot(s) {
  return typeof s === 'function' || Object.prototype.toString.call(s) === '[object Object]' && !(0, _vue.isVNode)(s);
}

var _createNamespace = (0, _utils.createNamespace)('overlay'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

var _default2 = createComponent({
  props: {
    show: Boolean,
    zIndex: [Number, String],
    duration: [Number, String],
    className: null,
    customStyle: Object,
    lockScroll: {
      type: Boolean,
      default: true
    }
  },
  setup: function setup(props, _ref) {
    var slots = _ref.slots;
    var lazyRender = (0, _useLazyRender.useLazyRender)(function () {
      return props.show;
    });

    var preventTouchMove = function preventTouchMove(event) {
      (0, _utils.preventDefault)(event, true);
    };

    var renderOverlay = lazyRender(function () {
      var style = (0, _extends2.default)({
        zIndex: props.zIndex !== undefined ? +props.zIndex : undefined
      }, props.customStyle);

      if ((0, _utils.isDef)(props.duration)) {
        style.animationDuration = props.duration + "s";
      }

      return (0, _vue.withDirectives)((0, _vue.createVNode)("div", {
        "style": style,
        "class": [bem(), props.className],
        "onTouchmove": props.lockScroll ? preventTouchMove : _utils.noop
      }, [slots.default == null ? void 0 : slots.default()]), [[_vue.vShow, props.show]]);
    });
    return function () {
      var _slot;

      return (0, _vue.createVNode)(_vue.Transition, {
        "name": "van-fade"
      }, _isSlot(_slot = renderOverlay()) ? _slot : {
        default: function _default() {
          return [_slot];
        }
      });
    };
  }
});

exports.default = _default2;