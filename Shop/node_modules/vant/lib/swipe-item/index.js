"use strict";

exports.__esModule = true;
exports.default = void 0;

var _vue = require("vue");

var _swipe = require("../swipe");

var _utils = require("../utils");

var _use = require("@vant/use");

var _useExpose = require("../composables/use-expose");

var _createNamespace = (0, _utils.createNamespace)('swipe-item'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

var _default = createComponent({
  setup: function setup(props, _ref) {
    var slots = _ref.slots;
    var rendered;
    var state = (0, _vue.reactive)({
      offset: 0,
      inited: false,
      mounted: false
    });

    var _useParent = (0, _use.useParent)(_swipe.SWIPE_KEY),
        parent = _useParent.parent,
        index = _useParent.index;

    var style = (0, _vue.computed)(function () {
      var style = {};
      var vertical = parent.props.vertical;

      if (parent.size.value) {
        style[vertical ? 'height' : 'width'] = parent.size.value + "px";
      }

      if (state.offset) {
        style.transform = "translate" + (vertical ? 'Y' : 'X') + "(" + state.offset + "px)";
      }

      return style;
    });
    var shouldRender = (0, _vue.computed)(function () {
      var _parent$props = parent.props,
          loop = _parent$props.loop,
          lazyRender = _parent$props.lazyRender;

      if (!lazyRender || rendered) {
        return true;
      } // wait for all item to mount, so we can get the exact count


      if (!state.mounted) {
        return false;
      }

      var active = parent.activeIndicator.value;
      var maxActive = parent.count.value - 1;
      var prevActive = active === 0 && loop ? maxActive : active - 1;
      var nextActive = active === maxActive && loop ? 0 : active + 1;
      rendered = index.value === active || index.value === prevActive || index.value === nextActive;
      return rendered;
    });

    var setOffset = function setOffset(offset) {
      state.offset = offset;
    };

    (0, _vue.onMounted)(function () {
      (0, _vue.nextTick)(function () {
        state.mounted = true;
      });
    });
    (0, _useExpose.useExpose)({
      setOffset: setOffset
    });
    return function () {
      return (0, _vue.createVNode)("div", {
        "class": bem(),
        "style": style.value
      }, [shouldRender.value ? slots.default == null ? void 0 : slots.default() : null]);
    };
  }
});

exports.default = _default;