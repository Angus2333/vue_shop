"use strict";

exports.__esModule = true;
exports.default = exports.ACTION_BAR_KEY = void 0;

var _vue = require("vue");

var _utils = require("../utils");

var _use = require("@vant/use");

var _createNamespace = (0, _utils.createNamespace)('action-bar'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

var ACTION_BAR_KEY = 'vanActionBar';
exports.ACTION_BAR_KEY = ACTION_BAR_KEY;

var _default = createComponent({
  props: {
    safeAreaInsetBottom: {
      type: Boolean,
      default: true
    }
  },
  setup: function setup(props, _ref) {
    var slots = _ref.slots;

    var _useChildren = (0, _use.useChildren)(ACTION_BAR_KEY),
        linkChildren = _useChildren.linkChildren;

    linkChildren();
    return function () {
      return (0, _vue.createVNode)("div", {
        "class": bem({
          unfit: !props.safeAreaInsetBottom
        })
      }, [slots.default == null ? void 0 : slots.default()]);
    };
  }
});

exports.default = _default;