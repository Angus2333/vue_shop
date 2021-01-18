"use strict";

exports.__esModule = true;
exports.default = void 0;

var _vue = require("vue");

var _utils = require("../utils");

var _constant = require("../utils/constant");

var _createNamespace = (0, _utils.createNamespace)('cell-group'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

var _default = createComponent({
  inheritAttrs: false,
  props: {
    title: String,
    border: {
      type: Boolean,
      default: true
    }
  },
  setup: function setup(props, _ref) {
    var slots = _ref.slots,
        attrs = _ref.attrs;
    return function () {
      var _ref2;

      var title = props.title,
          border = props.border;
      var Group = (0, _vue.createVNode)("div", (0, _vue.mergeProps)({
        "class": [bem(), (_ref2 = {}, _ref2[_constant.BORDER_TOP_BOTTOM] = border, _ref2)]
      }, attrs), [slots.default == null ? void 0 : slots.default()]);

      if (title || slots.title) {
        return (0, _vue.createVNode)(_vue.Fragment, null, [(0, _vue.createVNode)("div", {
          "class": bem('title')
        }, [slots.title ? slots.title() : title]), Group]);
      }

      return Group;
    };
  }
});

exports.default = _default;