"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _vue = require("vue");

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _utils = require("../utils");

var _popup = _interopRequireWildcard(require("../popup"));

var _createNamespace = (0, _utils.createNamespace)('notify'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

var _default2 = createComponent({
  props: (0, _extends2.default)({}, _popup.popupSharedProps, {
    color: String,
    message: [Number, String],
    className: null,
    background: String,
    type: {
      type: String,
      default: 'danger'
    }
  }),
  setup: function setup(props, _ref) {
    var slots = _ref.slots;
    return function () {
      var style = {
        color: props.color,
        background: props.background
      };
      return (0, _vue.createVNode)(_popup.default, {
        "show": props.show,
        "class": [bem([props.type]), props.className],
        "style": style,
        "overlay": false,
        "position": "top",
        "duration": 0.2,
        "lockScroll": false
      }, {
        default: function _default() {
          return [slots.default ? slots.default() : props.message];
        }
      });
    };
  }
});

exports.default = _default2;