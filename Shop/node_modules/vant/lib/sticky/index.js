"use strict";

exports.__esModule = true;
exports.default = void 0;

var _vue = require("vue");

var _utils = require("../utils");

var _use = require("@vant/use");

var _useVisibilityChange = require("../composables/use-visibility-change");

// Utils
// Composition
var _createNamespace = (0, _utils.createNamespace)('sticky'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

var _default = createComponent({
  props: {
    zIndex: [Number, String],
    container: null,
    offsetTop: {
      type: [Number, String],
      default: 0
    }
  },
  emits: ['scroll'],
  setup: function setup(props, _ref) {
    var emit = _ref.emit,
        slots = _ref.slots;
    var root = (0, _vue.ref)();
    var scrollParent = (0, _use.useScrollParent)(root);
    var state = (0, _vue.reactive)({
      fixed: false,
      height: 0,
      transform: 0
    });
    var offsetTop = (0, _vue.computed)(function () {
      return (0, _utils.unitToPx)(props.offsetTop);
    });
    var style = (0, _vue.computed)(function () {
      if (!state.fixed) {
        return;
      }

      var top = offsetTop.value ? offsetTop.value + "px" : undefined;
      var transform = state.transform ? "translate3d(0, " + state.transform + "px, 0)" : undefined;
      return {
        top: top,
        zIndex: props.zIndex !== undefined ? +props.zIndex : undefined,
        transform: transform
      };
    });

    var emitScrollEvent = function emitScrollEvent(scrollTop) {
      emit('scroll', {
        scrollTop: scrollTop,
        isFixed: state.fixed
      });
    };

    var onScroll = function onScroll() {
      if (!root.value || (0, _utils.isHidden)(root)) {
        return;
      }

      state.height = root.value.offsetHeight;
      var container = props.container;
      var scrollTop = (0, _utils.getScrollTop)(window);
      var topToPageTop = (0, _utils.getElementTop)(root.value); // The sticky component should be kept inside the container element

      if (container) {
        var bottomToPageTop = topToPageTop + container.offsetHeight;

        if (scrollTop + offsetTop.value + state.height > bottomToPageTop) {
          var distanceToBottom = state.height + scrollTop - bottomToPageTop;

          if (distanceToBottom < state.height) {
            state.fixed = true;
            state.transform = -(distanceToBottom + offsetTop.value);
          } else {
            state.fixed = false;
          }

          emitScrollEvent(scrollTop);
          return;
        }
      }

      if (scrollTop + offsetTop.value > topToPageTop) {
        state.fixed = true;
        state.transform = 0;
      } else {
        state.fixed = false;
      }

      emitScrollEvent(scrollTop);
    };

    (0, _use.useEventListener)('scroll', onScroll, {
      target: scrollParent
    });
    (0, _useVisibilityChange.useVisibilityChange)(root, onScroll);
    return function () {
      var fixed = state.fixed,
          height = state.height;
      var rootStyle = {
        height: fixed ? height + "px" : undefined
      };
      return (0, _vue.createVNode)("div", {
        "ref": root,
        "style": rootStyle
      }, [(0, _vue.createVNode)("div", {
        "class": bem({
          fixed: fixed
        }),
        "style": style.value
      }, [slots.default == null ? void 0 : slots.default()])]);
    };
  }
});

exports.default = _default;