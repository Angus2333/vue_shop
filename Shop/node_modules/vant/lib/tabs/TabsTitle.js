"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _vue = require("vue");

var _utils = require("../utils");

var _badge = _interopRequireDefault(require("../badge"));

function _isSlot(s) {
  return typeof s === 'function' || Object.prototype.toString.call(s) === '[object Object]' && !(0, _vue.isVNode)(s);
}

var _createNamespace = (0, _utils.createNamespace)('tab'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

var _default2 = createComponent({
  props: {
    dot: Boolean,
    type: String,
    color: String,
    title: String,
    badge: [Number, String],
    isActive: Boolean,
    disabled: Boolean,
    scrollable: Boolean,
    activeColor: String,
    renderTitle: Function,
    inactiveColor: String
  },
  setup: function setup(props) {
    var style = (0, _vue.computed)(function () {
      var style = {};
      var type = props.type,
          color = props.color,
          disabled = props.disabled,
          isActive = props.isActive,
          activeColor = props.activeColor,
          inactiveColor = props.inactiveColor;
      var isCard = type === 'card'; // card theme color

      if (color && isCard) {
        style.borderColor = color;

        if (!disabled) {
          if (isActive) {
            style.backgroundColor = color;
          } else {
            style.color = color;
          }
        }
      }

      var titleColor = isActive ? activeColor : inactiveColor;

      if (titleColor) {
        style.color = titleColor;
      }

      return style;
    });

    var renderText = function renderText() {
      var Text = (0, _vue.createVNode)("span", {
        "class": bem('text', {
          ellipsis: !props.scrollable
        })
      }, [props.renderTitle ? props.renderTitle() : props.title]);

      if (props.dot || (0, _utils.isDef)(props.badge) && props.badge !== '') {
        return (0, _vue.createVNode)(_badge.default, {
          "dot": props.dot,
          "content": props.badge
        }, _isSlot(Text) ? Text : {
          default: function _default() {
            return [Text];
          }
        });
      }

      return Text;
    };

    return function () {
      return (0, _vue.createVNode)("div", {
        "role": "tab",
        "class": [bem({
          active: props.isActive,
          disabled: props.disabled
        })],
        "style": style.value,
        "aria-selected": props.isActive
      }, [renderText()]);
    };
  }
});

exports.default = _default2;