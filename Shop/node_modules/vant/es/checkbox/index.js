import { createVNode as _createVNode } from "vue";
import { mergeProps as _mergeProps } from "vue";
import { resolveDirective as _resolveDirective } from "vue";
import _extends from "@babel/runtime/helpers/esm/extends";
import { computed, watch } from 'vue';
import { createNamespace, pick } from '../utils';
import { useParent } from '@vant/use';
import { useExpose } from '../composables/use-expose';
import { useLinkField } from '../composables/use-link-field';
import Checker, { checkerProps } from './Checker';

var _createNamespace = createNamespace('checkbox'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

export var CHECKBOX_KEY = 'vanCheckbox';
export default createComponent({
  props: _extends({}, checkerProps, {
    bindGroup: {
      type: Boolean,
      default: true
    }
  }),
  emits: ['change', 'update:modelValue'],
  setup: function setup(props, _ref) {
    var emit = _ref.emit,
        slots = _ref.slots;

    var _useParent = useParent(CHECKBOX_KEY),
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

    var checked = computed(function () {
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

    watch(function () {
      return props.modelValue;
    }, function (value) {
      emit('change', value);
    });
    useExpose({
      toggle: toggle,
      props: props,
      checked: checked
    });
    useLinkField(function () {
      return props.modelValue;
    });
    return function () {
      return _createVNode(Checker, _mergeProps({
        "bem": bem,
        "role": "checkbox",
        "parent": parent,
        "checked": checked.value,
        "bindGroup": props.bindGroup,
        "onToggle": toggle
      }, props), _extends({}, pick(slots, ['default', 'icon'])));
    };
  }
});