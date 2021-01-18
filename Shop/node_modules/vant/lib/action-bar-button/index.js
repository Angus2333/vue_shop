"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _vue = require("vue");

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _utils = require("../utils");

var _actionBar = require("../action-bar");

var _use = require("@vant/use");

var _useExpose = require("../composables/use-expose");

var _useRoute = require("../composables/use-route");

var _button = _interopRequireDefault(require("../button"));

// Composition
// Components
var _createNamespace = (0, _utils.createNamespace)('action-bar-button'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

var _default2 = createComponent({
  props: (0, _extends2.default)({}, _useRoute.routeProps, {
    type: String,
    text: String,
    icon: String,
    color: String,
    loading: Boolean,
    disabled: Boolean
  }),
  setup: function setup(props, _ref) {
    var slots = _ref.slots;
    var route = (0, _useRoute.useRoute)();

    var _useParent = (0, _use.useParent)(_actionBar.ACTION_BAR_KEY),
        parent = _useParent.parent,
        index = _useParent.index;

    var isFirst = (0, _vue.computed)(function () {
      if (parent) {
        var prev = parent.children[index.value - 1];
        return !(prev && 'isButton' in prev);
      }
    });
    var isLast = (0, _vue.computed)(function () {
      if (parent) {
        var next = parent.children[index.value + 1];
        return !(next && 'isButton' in next);
      }
    });
    (0, _useExpose.useExpose)({
      isButton: true
    });
    return function () {
      var type = props.type,
          icon = props.icon,
          text = props.text,
          color = props.color,
          loading = props.loading,
          disabled = props.disabled;
      return (0, _vue.createVNode)(_button.default, {
        "class": bem([type, {
          last: isLast.value,
          first: isFirst.value
        }]),
        "size": "large",
        "type": type,
        "icon": icon,
        "color": color,
        "loading": loading,
        "disabled": disabled,
        "onClick": route
      }, {
        default: function _default() {
          return [slots.default ? slots.default() : text];
        }
      });
    };
  }
});

exports.default = _default2;