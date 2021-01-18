"use strict";

exports.__esModule = true;
exports.default = exports.COLLAPSE_KEY = void 0;

var _vue = require("vue");

var _utils = require("../utils");

var _constant = require("../utils/constant");

var _use = require("@vant/use");

var _createNamespace = (0, _utils.createNamespace)('collapse'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

var COLLAPSE_KEY = 'vanCollapse';
exports.COLLAPSE_KEY = COLLAPSE_KEY;

var _default = createComponent({
  props: {
    accordion: Boolean,
    modelValue: [String, Number, Array],
    border: {
      type: Boolean,
      default: true
    }
  },
  emits: ['change', 'update:modelValue'],
  setup: function setup(props, _ref) {
    var emit = _ref.emit,
        slots = _ref.slots;

    var _useChildren = (0, _use.useChildren)(COLLAPSE_KEY),
        linkChildren = _useChildren.linkChildren;

    var toggle = function toggle(name, expanded) {
      var accordion = props.accordion,
          modelValue = props.modelValue;

      if (accordion) {
        if (name === modelValue) {
          name = '';
        }
      } else if (expanded) {
        name = modelValue.concat(name);
      } else {
        name = modelValue.filter(function (activeName) {
          return activeName !== name;
        });
      }

      emit('change', name);
      emit('update:modelValue', name);
    };

    var isExpanded = function isExpanded(name) {
      var accordion = props.accordion,
          modelValue = props.modelValue;

      if (!accordion && !Array.isArray(modelValue) && process.env.NODE_ENV !== 'production') {
        console.error('[Vant] Collapse: type of prop "modelValue" should be Array');
        return;
      }

      return accordion ? modelValue === name : modelValue.indexOf(name) !== -1;
    };

    linkChildren({
      toggle: toggle,
      isExpanded: isExpanded
    });
    return function () {
      var _ref2;

      return (0, _vue.createVNode)("div", {
        "class": [bem(), (_ref2 = {}, _ref2[_constant.BORDER_TOP_BOTTOM] = props.border, _ref2)]
      }, [slots.default == null ? void 0 : slots.default()]);
    };
  }
});

exports.default = _default;