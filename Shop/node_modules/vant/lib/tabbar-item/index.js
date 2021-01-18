"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _vue = require("vue");

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _tabbar = require("../tabbar");

var _utils = require("../utils");

var _use = require("@vant/use");

var _useRoute = require("../composables/use-route");

var _icon = _interopRequireDefault(require("../icon"));

var _badge = _interopRequireDefault(require("../badge"));

// Utils
// Composition
// Components
function _isSlot(s) {
  return typeof s === 'function' || Object.prototype.toString.call(s) === '[object Object]' && !(0, _vue.isVNode)(s);
}

var _createNamespace = (0, _utils.createNamespace)('tabbar-item'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

var _default2 = createComponent({
  props: (0, _extends2.default)({}, _useRoute.routeProps, {
    dot: Boolean,
    icon: String,
    name: [Number, String],
    badge: [Number, String],
    iconPrefix: String
  }),
  emits: ['click'],
  setup: function setup(props, _ref) {
    var emit = _ref.emit,
        slots = _ref.slots;
    var route = (0, _useRoute.useRoute)();
    var vm = (0, _vue.getCurrentInstance)().proxy;

    var _useParent = (0, _use.useParent)(_tabbar.TABBAR_KEY),
        parent = _useParent.parent,
        index = _useParent.index;

    var active = (0, _vue.computed)(function () {
      var _parent$props = parent.props,
          route = _parent$props.route,
          modelValue = _parent$props.modelValue;

      if (route && '$route' in vm) {
        var $route = vm.$route;
        var to = props.to;
        var config = (0, _utils.isObject)(to) ? to : {
          path: to
        };
        var pathMatched = config.path === $route.path;
        var nameMatched = (0, _utils.isDef)(config.name) && config.name === $route.name;
        return pathMatched || nameMatched;
      }

      return (props.name || index.value) === modelValue;
    });

    var onClick = function onClick(event) {
      parent.setActive(props.name || index.value);
      emit('click', event);
      route();
    };

    var renderIcon = function renderIcon() {
      if (slots.icon) {
        return slots.icon({
          active: active.value
        });
      }

      if (props.icon) {
        return (0, _vue.createVNode)(_icon.default, {
          "name": props.icon,
          "classPrefix": props.iconPrefix
        }, null);
      }
    };

    return function () {
      var _slot;

      var dot = props.dot,
          badge = props.badge;
      var _parent$props2 = parent.props,
          activeColor = _parent$props2.activeColor,
          inactiveColor = _parent$props2.inactiveColor;
      var color = active.value ? activeColor : inactiveColor;
      return (0, _vue.createVNode)("div", {
        "class": bem({
          active: active.value
        }),
        "style": {
          color: color
        },
        "onClick": onClick
      }, [(0, _vue.createVNode)(_badge.default, {
        "dot": dot,
        "content": badge,
        "class": bem('icon')
      }, _isSlot(_slot = renderIcon()) ? _slot : {
        default: function _default() {
          return [_slot];
        }
      }), (0, _vue.createVNode)("div", {
        "class": bem('text')
      }, [slots.default == null ? void 0 : slots.default({
        active: active.value
      })])]);
    };
  }
});

exports.default = _default2;