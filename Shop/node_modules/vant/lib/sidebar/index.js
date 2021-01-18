"use strict";

exports.__esModule = true;
exports.default = exports.SIDEBAR_KEY = void 0;

var _vue = require("vue");

var _utils = require("../utils");

var _use = require("@vant/use");

var _createNamespace = (0, _utils.createNamespace)('sidebar'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

var SIDEBAR_KEY = 'vanSidebar';
exports.SIDEBAR_KEY = SIDEBAR_KEY;

var _default = createComponent({
  props: {
    modelValue: {
      type: [Number, String],
      default: 0
    }
  },
  emits: ['change', 'update:modelValue'],
  setup: function setup(props, _ref) {
    var emit = _ref.emit,
        slots = _ref.slots;

    var _useChildren = (0, _use.useChildren)(SIDEBAR_KEY),
        linkChildren = _useChildren.linkChildren;

    var active = function active() {
      return +props.modelValue;
    };

    var setActive = function setActive(value) {
      if (value !== active()) {
        emit('change', value);
      }
    };

    (0, _vue.watch)(active, setActive);
    linkChildren({
      emit: emit,
      active: active,
      setActive: setActive
    });
    return function () {
      return (0, _vue.createVNode)("div", {
        "class": bem()
      }, [slots.default == null ? void 0 : slots.default()]);
    };
  }
});

exports.default = _default;