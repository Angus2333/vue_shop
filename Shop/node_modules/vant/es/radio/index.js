import _extends from "@babel/runtime/helpers/esm/extends";
import { createVNode as _createVNode } from "vue";
import { mergeProps as _mergeProps } from "vue";
import { resolveDirective as _resolveDirective } from "vue";
import { pick, createNamespace } from '../utils';
import { useParent } from '@vant/use';
import Checker, { checkerProps } from '../checkbox/Checker';
import { RADIO_KEY } from '../radio-group';

var _createNamespace = createNamespace('radio'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

export default createComponent({
  props: checkerProps,
  emits: ['update:modelValue'],
  setup: function setup(props, _ref) {
    var emit = _ref.emit,
        slots = _ref.slots;

    var _useParent = useParent(RADIO_KEY),
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
      return _createVNode(Checker, _mergeProps({
        "bem": bem,
        "role": "radio",
        "parent": parent,
        "checked": checked(),
        "onToggle": toggle
      }, props), _extends({}, pick(slots, ['default', 'icon'])));
    };
  }
});