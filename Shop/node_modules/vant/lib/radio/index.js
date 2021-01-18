"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _vue = require("vue");

var _utils = require("../utils");

var _use = require("@vant/use");

var _Checker = _interopRequireWildcard(require("../checkbox/Checker"));

var _radioGroup = require("../radio-group");

var _createNamespace = (0, _utils.createNamespace)('radio'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

var _default = createComponent({
  props: _Checker.checkerProps,
  emits: ['update:modelValue'],
  setup: function setup(props, _ref) {
    var emit = _ref.emit,
        slots = _ref.slots;

    var _useParent = (0, _use.useParent)(_radioGroup.RADIO_KEY),
        parent = _useParent.parent;

    var checked = function checked() {
      var value = parent ? parent.props.modelValue : props.modelValue;
      return value === props.name;
    };

    var toggle = function toggle() {
      var emitter = parent ? parent.emit : emit;
      emitter('update:modelValue', props.name);
    };

    return function () {
      return (0, _vue.createVNode)(_Checker.default, (0, _vue.mergeProps)({
        "bem": bem,
        "role": "radio",
        "parent": parent,
        "checked": checked(),
        "onToggle": toggle
      }, props), (0, _extends2.default)({}, (0, _utils.pick)(slots, ['default', 'icon'])));
    };
  }
});

exports.default = _default;