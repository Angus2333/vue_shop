"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = exports.CHECKBOX_KEY = void 0;

var _vue = require("vue");

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _utils = require("../utils");

var _use = require("@vant/use");

var _useExpose = require("../composables/use-expose");

var _useLinkField = require("../composables/use-link-field");

var _Checker = _interopRequireWildcard(require("./Checker"));

var _createNamespace = (0, _utils.createNamespace)('checkbox'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

var CHECKBOX_KEY = 'vanCheckbox';
exports.CHECKBOX_KEY = CHECKBOX_KEY;

var _default = createComponent({
  props: (0, _extends2.default)({}, _Checker.checkerProps, {
    bindGroup: {
      type: Boolean,
      default: true
    }
  }),
  emits: ['change', 'update:modelValue'],
  setup: function setup(props, _ref) {
    var emit = _ref.emit,
        slots = _ref.slots;

    var _useParent = (0, _use.useParent)(CHECKBOX_KEY),
        parent = _useParent.parent;

    var setParentValue = function setParentValue(checked) {
      var name = props.name;
      var _parent$props = parent.props,
          max = _parent$props.max,
          modelValue = _parent$props.modelValue;
      var value = modelValue.slice();

      if (checked) {
        var overlimit = max && value.length >= max;

        if (!overlimit && value.indexOf(name) === -1) {
          value.push(name);

          if (props.bindGroup) {
            parent.emit('update:modelValue', value);
          }
        }
      } else {
        var index = value.indexOf(name);

        if (index !== -1) {
          value.splice(index, 1);

          if (props.bindGroup) {
            parent.emit('update:modelValue', value);
          }
        }
      }
    };

    var checked = (0, _vue.computed)(function () {
      if (parent && props.bindGroup) {
        return parent.props.modelValue.indexOf(props.name) !== -1;
      }

      return props.modelValue;
    });

    var toggle = function toggle(newValue) {
      if (newValue === void 0) {
        newValue = !checked.value;
      }

      if (parent && props.bindGroup) {
        setParentValue(newValue);
      } else {
        emit('update:modelValue', newValue);
      }
    };

    (0, _vue.watch)(function () {
      return props.modelValue;
    }, function (value) {
      emit('change', value);
    });
    (0, _useExpose.useExpose)({
      toggle: toggle,
      props: props,
      checked: checked
    });
    (0, _useLinkField.useLinkField)(function () {
      return props.modelValue;
    });
    return function () {
      return (0, _vue.createVNode)(_Checker.default, (0, _vue.mergeProps)({
        "bem": bem,
        "role": "checkbox",
        "parent": parent,
        "checked": checked.value,
        "bindGroup": props.bindGroup,
        "onToggle": toggle
      }, props), (0, _extends2.default)({}, (0, _utils.pick)(slots, ['default', 'icon'])));
    };
  }
});

exports.default = _default;