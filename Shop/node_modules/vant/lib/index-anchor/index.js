"use strict";

exports.__esModule = true;
exports.default = void 0;

var _vue = require("vue");

var _utils = require("../utils");

var _constant = require("../utils/constant");

var _indexBar = require("../index-bar");

var _scroll = require("../utils/dom/scroll");

var _use = require("@vant/use");

var _useHeight = require("../composables/use-height");

var _useExpose = require("../composables/use-expose");

// Utils
// Composition
var _createNamespace = (0, _utils.createNamespace)('index-anchor'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

var _default = createComponent({
  props: {
    index: [Number, String]
  },
  setup: function setup(props, _ref) {
    var slots = _ref.slots;
    var state = (0, _vue.reactive)({
      top: 0,
      left: null,
      rect: {
        top: 0,
        height: 0
      },
      width: null,
      active: false
    });
    var root = (0, _vue.ref)();

    var _useParent = (0, _use.useParent)(_indexBar.INDEX_BAR_KEY),
        parent = _useParent.parent;

    var isSticky = function isSticky() {
      return state.active && parent.props.sticky;
    };

    var anchorStyle = (0, _vue.computed)(function () {
      var _parent$props = parent.props,
          zIndex = _parent$props.zIndex,
          highlightColor = _parent$props.highlightColor;

      if (isSticky()) {
        return {
          zIndex: "" + zIndex,
          left: state.left ? state.left + "px" : null,
          width: state.width ? state.width + "px" : null,
          transform: state.top ? "translate3d(0, " + state.top + "px, 0)" : null,
          color: highlightColor
        };
      }
    });

    var getRect = function getRect(scrollParent, scrollParentRect) {
      var rootRect = (0, _use.useRect)(root);
      state.rect.height = rootRect.height;

      if (scrollParent === window || scrollParent === document.body) {
        state.rect.top = rootRect.top + (0, _scroll.getRootScrollTop)();
      } else {
        state.rect.top = rootRect.top + (0, _scroll.getScrollTop)(scrollParent) - scrollParentRect.top;
      }

      return state.rect;
    };

    (0, _vue.onMounted)(function () {
      state.rect.height = (0, _useHeight.useHeight)(root);
    });
    (0, _useExpose.useExpose)({
      state: state,
      getRect: getRect
    });
    return function () {
      var _ref2;

      var sticky = isSticky();
      return (0, _vue.createVNode)("div", {
        "ref": root,
        "style": {
          height: sticky ? state.rect.height + "px" : null
        }
      }, [(0, _vue.createVNode)("div", {
        "style": anchorStyle.value,
        "class": [bem({
          sticky: sticky
        }), (_ref2 = {}, _ref2[_constant.BORDER_BOTTOM] = sticky, _ref2)]
      }, [slots.default ? slots.default() : props.index])]);
    };
  }
});

exports.default = _default;