"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _vue = require("vue");

var _utils = require("../utils");

var _useLinkField = require("../composables/use-link-field");

var _loading = _interopRequireDefault(require("../loading"));

var _createNamespace = (0, _utils.createNamespace)('switch'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

var _default = createComponent({
  props: {
    size: [Number, String],
    loading: Boolean,
    disabled: Boolean,
    modelValue: null,
    activeColor: String,
    inactiveColor: String,
    activeValue: {
      type: null,
      default: true
    },
    inactiveValue: {
      type: null,
      default: false
    }
  },
  emits: ['change', 'update:modelValue'],
  setup: function setup(props, _ref) {
    var emit = _ref.emit;

    var isChecked = function isChecked() {
      return props.modelValue === props.activeValue;
    };

    var onClick = function onClick() {
      if (!props.disabled && !props.loading) {
        var newValue = isChecked() ? props.inactiveValue : props.activeValue;
        emit('update:modelValue', newValue);
        emit('change', newValue);
      }
    };

    var renderLoading = function renderLoading() {
      if (props.loading) {
        var color = isChecked() ? props.activeColor : props.inactiveColor;
        return (0, _vue.createVNode)(_loading.default, {
          "class": bem('loading'),
          "color": color
        }, null);
      }
    };

    (0, _useLinkField.useLinkField)(function () {
      return props.modelValue;
    });
    return function () {
      var size = props.size,
          loading = props.loading,
          disabled = props.disabled,
          activeColor = props.activeColor,
          inactiveColor = props.inactiveColor;
      var checked = isChecked();
      var style = {
        fontSize: (0, _utils.addUnit)(size),
        backgroundColor: checked ? activeColor : inactiveColor
      };
      return (0, _vue.createVNode)("div", {
        "role": "switch",
        "class": bem({
          on: checked,
          loading: loading,
          disabled: disabled
        }),
        "style": style,
        "aria-checked": checked,
        "onClick": onClick
      }, [(0, _vue.createVNode)("div", {
        "class": bem('node')
      }, [renderLoading()])]);
    };
  }
});

exports.default = _default;