"use strict";

exports.__esModule = true;
exports.default = void 0;

var _vue = require("vue");

var _utils = require("../utils");

var _checkbox = require("../checkbox");

var _use = require("@vant/use");

var _useExpose = require("../composables/use-expose");

var _useLinkField = require("../composables/use-link-field");

var _createNamespace = (0, _utils.createNamespace)('checkbox-group'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

var _default2 = createComponent({
  props: {
    max: [Number, String],
    disabled: Boolean,
    direction: String,
    iconSize: [Number, String],
    checkedColor: String,
    modelValue: {
      type: Array,
      default: function _default() {
        return [];
      }
    }
  },
  emits: ['change', 'update:modelValue'],
  setup: function setup(props, _ref) {
    var emit = _ref.emit,
        slots = _ref.slots;

    var _useChildren = (0, _use.useChildren)(_checkbox.CHECKBOX_KEY),
        children = _useChildren.children,
        linkChildren = _useChildren.linkChildren;

    var toggleAll = function toggleAll(options) {
      if (options === void 0) {
        options = {};
      }

      if (typeof options === 'boolean') {
        options = {
          checked: options
        };
      }

      var _options = options,
          checked = _options.checked,
          skipDisabled = _options.skipDisabled;
      var checkedChildren = children.filter(function (item) {
        if (!item.props.bindGroup) {
          return false;
        }

        if (item.props.disabled && skipDisabled) {
          return item.checked.value;
        }

        return checked != null ? checked : !item.checked.value;
      });
      var names = checkedChildren.map(function (item) {
        return item.name;
      });
      emit('update:modelValue', names);
    };

    (0, _vue.watch)(function () {
      return props.modelValue;
    }, function (value) {
      emit('change', value);
    });
    (0, _useExpose.useExpose)({
      toggleAll: toggleAll
    });
    (0, _useLinkField.useLinkField)(function () {
      return props.modelValue;
    });
    linkChildren({
      emit: emit,
      props: props
    });
    return function () {
      return (0, _vue.createVNode)("div", {
        "class": bem([props.direction])
      }, [slots.default == null ? void 0 : slots.default()]);
    };
  }
});

exports.default = _default2;