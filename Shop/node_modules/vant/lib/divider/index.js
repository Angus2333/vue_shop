"use strict";

exports.__esModule = true;
exports.default = void 0;

var _vue = require("vue");

var _utils = require("../utils");

var _createNamespace = (0, _utils.createNamespace)('divider'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

var _default = createComponent({
  props: {
    dashed: Boolean,
    hairline: {
      type: Boolean,
      default: true
    },
    contentPosition: {
      type: String,
      default: 'center'
    }
  },
  setup: function setup(props, _ref) {
    var slots = _ref.slots;
    return function () {
      var _bem;

      return (0, _vue.createVNode)("div", {
        "role": "separator",
        "class": bem((_bem = {
          dashed: props.dashed,
          hairline: props.hairline
        }, _bem["content-" + props.contentPosition] = !!slots.default, _bem))
      }, [slots.default == null ? void 0 : slots.default()]);
    };
  }
});

exports.default = _default;