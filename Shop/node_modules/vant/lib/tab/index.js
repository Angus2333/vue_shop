"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _vue = require("vue");

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _utils = require("../utils");

var _tabs = require("../tabs");

var _use = require("@vant/use");

var _useRoute = require("../composables/use-route");

var _swipeItem = _interopRequireDefault(require("../swipe-item"));

// Composition
// Components
function _isSlot(s) {
  return typeof s === 'function' || Object.prototype.toString.call(s) === '[object Object]' && !(0, _vue.isVNode)(s);
}

var _createNamespace = (0, _utils.createNamespace)('tab'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

var _default2 = createComponent({
  props: (0, _extends2.default)({}, _useRoute.routeProps, {
    dot: Boolean,
    name: [Number, String],
    badge: [Number, String],
    title: String,
    titleStyle: null,
    titleClass: null,
    disabled: Boolean
  }),
  setup: function setup(props, _ref) {
    var slots = _ref.slots;
    var inited = (0, _vue.ref)(false);

    var _useParent = (0, _use.useParent)(_tabs.TABS_KEY),
        parent = _useParent.parent,
        index = _useParent.index;

    if (!parent) {
      throw new Error('[Vant] Tabs: <van-tab> must be used inside <van-tabs>');
    }

    var getName = function getName() {
      var _props$name;

      return (_props$name = props.name) != null ? _props$name : index.value;
    };

    var init = function init() {
      inited.value = true;

      if (parent.props.lazyRender) {
        (0, _vue.nextTick)(function () {
          parent.emit('rendered', getName(), props.title);
        });
      }
    };

    var isActive = function isActive() {
      var active = getName() === parent.currentName.value;

      if (active && !inited.value) {
        init();
      }

      return active;
    };

    (0, _vue.watch)(function () {
      return props.title;
    }, function () {
      parent.setLine();
      parent.scrollIntoView();
    });
    return function () {
      var _parent$props = parent.props,
          animated = _parent$props.animated,
          swipeable = _parent$props.swipeable,
          scrollspy = _parent$props.scrollspy,
          lazyRender = _parent$props.lazyRender;

      if (!slots.default && !animated) {
        return;
      }

      var active = isActive();
      var show = scrollspy || active;

      if (animated || swipeable) {
        var _slot;

        return (0, _vue.createVNode)(_swipeItem.default, {
          "role": "tabpanel",
          "aria-hidden": !active,
          "class": bem('pane-wrapper', {
            inactive: !active
          })
        }, _isSlot(_slot = (0, _vue.createVNode)("div", {
          "class": bem('pane')
        }, [slots.default == null ? void 0 : slots.default()])) ? _slot : {
          default: function _default() {
            return [_slot];
          }
        });
      }

      var shouldRender = inited.value || scrollspy || !lazyRender;
      var Content = shouldRender ? slots.default == null ? void 0 : slots.default() : null;
      return (0, _vue.withDirectives)((0, _vue.createVNode)("div", {
        "role": "tabpanel",
        "class": bem('pane')
      }, _isSlot(Content) ? Content : {
        default: function _default() {
          return [Content];
        }
      }), [[_vue.vShow, show]]);
    };
  }
});

exports.default = _default2;