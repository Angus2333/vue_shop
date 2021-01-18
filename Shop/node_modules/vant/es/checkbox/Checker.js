import { isVNode as _isVNode } from "vue";
import { createVNode as _createVNode } from "vue";
import _extends from "@babel/runtime/helpers/esm/extends";
import { ref, computed, defineComponent } from 'vue';
import { addUnit } from '../utils';
import Icon from '../icon';

function _isSlot(s) {
  return typeof s === 'function' || Object.prototype.toString.call(s) === '[object Object]' && !_isVNode(s);
}

export var checkerProps = {
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
export default defineComponent({
  props: _extends({}, checkerProps, {
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
    var iconRef = ref();

    var getParentProp = function getParentProp(name) {
      if (props.parent && props.bindGroup) {
        return props.parent.props[name];
      }

      return null;
    };

    var disabled = computed(function () {
      return getParentProp('disabled') || props.disabled;
    });
    var direction = computed(function () {
      return getParentProp('direction') || null;
    });
    var iconStyle = computed(function () {
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
      return _createVNode("div", {
        "ref": iconRef,
        "class": bem('icon', [shape, {
          disabled: disabled.value,
          checked: checked
        }]),
        "style": {
          fontSize: addUnit(iconSize)
        }
      }, [slots.icon ? slots.icon({
        checked: checked
      }) : _createVNode(Icon, {
        "name": "success",
        "style": iconStyle.value
      }, null)]);
    };

    var renderLabel = function renderLabel() {
      if (slots.default) {
        return _createVNode("span", {
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

      return _createVNode("div", {
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