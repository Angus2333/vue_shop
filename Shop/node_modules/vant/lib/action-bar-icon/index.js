"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _vue = require("vue");

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _utils = require("../utils");

var _actionBar = require("../action-bar");

var _use = require("@vant/use");

var _useRoute = require("../composables/use-route");

var _icon = _interopRequireDefault(require("../icon"));

var _badge = _interopRequireDefault(require("../badge"));

// Composition
// Components
function _isSlot(s) {
  return typeof s === 'function' || Object.prototype.toString.call(s) === '[object Object]' && !(0, _vue.isVNode)(s);
}

var _createNamespace = (0, _utils.createNamespace)('action-bar-icon'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

var _default2 = createComponent({
  props: (0, _extends2.default)({}, _useRoute.routeProps, {
    dot: Boolean,
    text: String,
    icon: String,
    color: String,
    badge: [Number, String],
    iconClass: null
  }),
  setup: function setup(props, _ref) {
    var slots = _ref.slots;
    var route = (0, _useRoute.useRoute)();
    (0, _use.useParent)(_actionBar.ACTION_BAR_KEY);

    var renderIcon = function renderIcon() {
      var dot = props.dot,
          badge = props.badge,
          icon = props.icon,
          color = props.color,
          iconClass = props.iconClass;

      if (slots.icon) {
        var _slot;

        return (0, _vue.createVNode)(_badge.default, {
          "dot": dot,
          "content": badge,
          "class": bem('icon')
        }, _isSlot(_slot = slots.icon()) ? _slot : {
          default: function _default() {
            return [_slot];
          }
        });
      }

      return (0, _vue.createVNode)(_icon.default, {
        "tag": "div",
        "dot": dot,
        "name": icon,
        "badge": badge,
        "color": color,
        "class": [bem('icon'), iconClass]
      }, null);
    };

    return function () {
      return (0, _vue.createVNode)("div", {
        "role": "button",
        "class": bem(),
        "tabindex": 0,
        "onClick": route
      }, [renderIcon(), slots.default ? slots.default() : props.text]);
    };
  }
});

exports.default = _default2;