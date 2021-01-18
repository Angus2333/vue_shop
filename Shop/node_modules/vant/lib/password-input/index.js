"use strict";

exports.__esModule = true;
exports.default = void 0;

var _vue = require("vue");

var _utils = require("../utils");

var _constant = require("../utils/constant");

function _isSlot(s) {
  return typeof s === 'function' || Object.prototype.toString.call(s) === '[object Object]' && !(0, _vue.isVNode)(s);
}

var _createNamespace = (0, _utils.createNamespace)('password-input'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

var _default2 = createComponent({
  props: {
    info: String,
    gutter: [Number, String],
    focused: Boolean,
    errorInfo: String,
    mask: {
      type: Boolean,
      default: true
    },
    value: {
      type: String,
      default: ''
    },
    length: {
      type: [Number, String],
      default: 6
    }
  },
  emits: ['focus'],
  setup: function setup(props, _ref) {
    var emit = _ref.emit;

    var onTouchStart = function onTouchStart(event) {
      event.stopPropagation();
      emit('focus', event);
    };

    var renderPoints = function renderPoints() {
      var Points = [];
      var mask = props.mask,
          value = props.value,
          length = props.length,
          gutter = props.gutter,
          focused = props.focused;

      for (var i = 0; i < length; i++) {
        var _ref2;

        var _char = value[i];
        var showBorder = i !== 0 && !gutter;
        var showCursor = focused && i === value.length;
        var style = void 0;

        if (i !== 0 && gutter) {
          style = {
            marginLeft: (0, _utils.addUnit)(gutter)
          };
        }

        Points.push((0, _vue.createVNode)("li", {
          "class": [(_ref2 = {}, _ref2[_constant.BORDER_LEFT] = showBorder, _ref2), bem('item', {
            focus: showCursor
          })],
          "style": style
        }, [mask ? (0, _vue.createVNode)("i", {
          "style": {
            visibility: _char ? 'visible' : 'hidden'
          }
        }, null) : _char, showCursor && (0, _vue.createVNode)("div", {
          "class": bem('cursor')
        }, null)]));
      }

      return Points;
    };

    return function () {
      var _ref3;

      var info = props.errorInfo || props.info;
      return (0, _vue.createVNode)("div", {
        "class": bem()
      }, [(0, _vue.createVNode)("ul", {
        "class": [bem('security'), (_ref3 = {}, _ref3[_constant.BORDER_SURROUND] = !props.gutter, _ref3)],
        "onTouchstart": onTouchStart
      }, [renderPoints()]), info && (0, _vue.createVNode)("div", {
        "class": bem(props.errorInfo ? 'error-info' : 'info')
      }, _isSlot(info) ? info : {
        default: function _default() {
          return [info];
        }
      })]);
    };
  }
});

exports.default = _default2;