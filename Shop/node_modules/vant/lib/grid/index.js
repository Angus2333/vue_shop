"use strict";

exports.__esModule = true;
exports.default = exports.GRID_KEY = void 0;

var _vue = require("vue");

var _utils = require("../utils");

var _constant = require("../utils/constant");

var _use = require("@vant/use");

var _createNamespace = (0, _utils.createNamespace)('grid'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

var GRID_KEY = 'vanGrid';
exports.GRID_KEY = GRID_KEY;

var _default = createComponent({
  props: {
    square: Boolean,
    gutter: [Number, String],
    iconSize: [Number, String],
    direction: String,
    clickable: Boolean,
    columnNum: {
      type: [Number, String],
      default: 4
    },
    center: {
      type: Boolean,
      default: true
    },
    border: {
      type: Boolean,
      default: true
    }
  },
  setup: function setup(props, _ref) {
    var slots = _ref.slots;

    var _useChildren = (0, _use.useChildren)(GRID_KEY),
        linkChildren = _useChildren.linkChildren;

    linkChildren({
      props: props
    });
    return function () {
      var _ref2;

      return (0, _vue.createVNode)("div", {
        "style": {
          paddingLeft: (0, _utils.addUnit)(props.gutter)
        },
        "class": [bem(), (_ref2 = {}, _ref2[_constant.BORDER_TOP] = props.border && !props.gutter, _ref2)]
      }, [slots.default == null ? void 0 : slots.default()]);
    };
  }
});

exports.default = _default;