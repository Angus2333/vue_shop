"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = exports.checkerProps = void 0;

var _vue = require("vue");

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _utils = require("../utils");

var _icon = _interopRequireDefault(require("../icon"));

function _isSlot(s) {
  return typeof s === 'function' || Object.prototype.toString.call(s) === '[object Object]' && !(0, _vue.isVNode)(s);
}

var checkerProps = {
  name: null,
  disabled: Boolean,
  iconSize: [Number, String],
  modelValue: null,
  checkedColor: String,
  labelPosition: String,
  labelDisabled: Boolean,
  shape: {
    type: String,
    default: 'round'
  }
};
exports.checkerProps = checkerProps;

var _default2 = (0, _vue.defineComponent)({
  props: (0, _extends2.default)({}, checkerProps, {
    role: String,
    parent: Object,
    checked: Boolean,
    bindGroup: {
      type: Boolean,
      default: true
    },
    bem: {
      type: Function,
      required: true
    }
  }),
  emits: ['click', 'toggle'],
  setup: function setup(props, _ref) {
    var emit = _ref.emit,
        slots = _ref.slots;
    var iconRef = (0, _vue.ref)();

    var getParentProp = function getParentProp(name) {
      if (props.parent && props.bindGroup) {
        return props.parent.props[name];
      }

      return null;
    };

    var disabled = (0, _vue.computed)(function () {
      return getParentProp('disabled') || props.disabled;
    });
    var direction = (0, _vue.computed)(function () {
      return getParentProp('direction') || null;
    });
    var iconStyle = (0, _vue.computed)(function () {
      var checkedColor = props.checkedColor || getParentProp('checkedColor');

      if (checkedColor && props.checked && !disabled.value) {
        return {
          borderColor: checkedColor,
          backgroundColor: checkedColor
        };
      }
    });

    var onClick = function onClick(event) {
      var target = event.target;
      var icon = iconRef.value;
      var iconClicked = icon === target || icon.contains(target);

      if (!disabled.value && (iconClicked || !props.labelDisabled)) {
        emit('toggle');
      }

      emit('click', event);
    };

    var renderIcon = function renderIcon() {
      var bem = props.bem,
          shape = props.shape,
          checked = props.checked;
      var iconSize = props.iconSize || getParentProp('iconSize');
      return (0, _vue.createVNode)("div", {
        "ref": iconRef,
        "class": bem('icon', [shape, {
          disabled: disabled.value,
          checked: checked
        }]),
        "style": {
          fontSize: (0, _utils.addUnit)(iconSize)
        }
      }, [slots.icon ? slots.icon({
        checked: checked
      }) : (0, _vue.createVNode)(_icon.default, {
        "name": "success",
        "style": iconStyle.value
      }, null)]);
    };

    var renderLabel = function renderLabel() {
      if (slots.default) {
        return (0, _vue.createVNode)("span", {
          "class": props.bem('label', [props.labelPosition, {
            disabled: disabled.value
          }])
        }, [slots.default()]);
      }
    };

    return function () {
      var nodes = [renderIcon()];

      if (props.labelPosition === 'left') {
        nodes.unshift(renderLabel());
      } else {
        nodes.push(renderLabel());
      }

      return (0, _vue.createVNode)("div", {
        "role": props.role,
        "class": props.bem([{
          disabled: disabled.value,
          'label-disabled': props.labelDisabled
        }, direction.value]),
        "tabindex": disabled.value ? -1 : 0,
        "aria-checked": props.checked,
        "onClick": onClick
      }, _isSlot(nodes) ? nodes : {
        default: function _default() {
          return [nodes];
        }
      });
    };
  }
});

exports.default = _default2;