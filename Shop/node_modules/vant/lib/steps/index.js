"use strict";

exports.__esModule = true;
exports.default = exports.STEPS_KEY = void 0;

var _vue = require("vue");

var _utils = require("../utils");

var _use = require("@vant/use");

var _createNamespace = (0, _utils.createNamespace)('steps'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

var STEPS_KEY = 'vanSteps';
exports.STEPS_KEY = STEPS_KEY;

var _default = createComponent({
  props: {
    activeColor: String,
    inactiveIcon: String,
    inactiveColor: String,
    active: {
      type: [Number, String],
      default: 0
    },
    direction: {
      type: String,
      default: 'horizontal'
    },
    activeIcon: {
      type: String,
      default: 'checked'
    }
  },
  emits: ['click-step'],
  setup: function setup(props, _ref) {
    var emit = _ref.emit,
        slots = _ref.slots;

    var _useChildren = (0, _use.useChildren)(STEPS_KEY),
        linkChildren = _useChildren.linkChildren;

    linkChildren({
      emit: emit,
      props: props
    });
    return function () {
      return (0, _vue.createVNode)("div", {
        "class": bem([props.direction])
      }, [(0, _vue.createVNode)("div", {
        "class": bem('items')
      }, [slots.default == null ? void 0 : slots.default()])]);
    };
  }
});

exports.default = _default;