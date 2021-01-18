"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _vue = require("vue");

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _utils = require("../utils");

var _use = require("@vant/use");

var _useRoute = require("../composables/use-route");

var _sidebar = require("../sidebar");

var _badge = _interopRequireDefault(require("../badge"));

var _createNamespace = (0, _utils.createNamespace)('sidebar-item'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

var _default2 = createComponent({
  props: (0, _extends2.default)({}, _useRoute.routeProps, {
    dot: Boolean,
    title: String,
    badge: [Number, String],
    disabled: Boolean
  }),
  emits: ['click'],
  setup: function setup(props, _ref) {
    var emit = _ref.emit,
        slots = _ref.slots;
    var route = (0, _useRoute.useRoute)();

    var _useParent = (0, _use.useParent)(_sidebar.SIDEBAR_KEY),
        parent = _useParent.parent,
        index = _useParent.index;

    var onClick = function onClick() {
      if (props.disabled) {
        return;
      }

      emit('click', index.value);
      parent.emit('update:modelValue', index.value);
      parent.setActive(index.value);
      route();
    };

    return function () {
      var dot = props.dot,
          badge = props.badge,
          title = props.title,
          disabled = props.disabled;
      var selected = index.value === parent.active();
      return (0, _vue.createVNode)("a", {
        "class": bem({
          select: selected,
          disabled: disabled
        }),
        "onClick": onClick
      }, [(0, _vue.createVNode)(_badge.default, {
        "dot": dot,
        "content": badge,
        "class": bem('text')
      }, {
        default: function _default() {
          return [slots.title ? slots.title() : title];
        }
      })]);
    };
  }
});

exports.default = _default2;