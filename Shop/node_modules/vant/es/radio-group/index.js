import { createVNode as _createVNode } from "vue";
import { watch } from 'vue';
import { createNamespace } from '../utils';
import { useChildren } from '@vant/use';
import { useLinkField } from '../composables/use-link-field';

var _createNamespace = createNamespace('radio-group'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

export var RADIO_KEY = 'vanRadio';
export default createComponent({
  props: {
    disabled: Boolean,
    iconSize: [Number, String],
    direction: String,
    modelValue: null,
    checkedColor: String
  },
  emits: ['change', 'update:modelValue'],
  setup: function setup(props, _ref) {
    var emit = _ref.emit,
        slots = _ref.slots;

    var _useChildren = useChildren(RADIO_KEY),
        linkChildren = _useChildren.linkChildren;

    watch(function () {
      return props.modelValue;
    }, function (value) {
      emit('change', value);
    });
    linkChildren({
      emit: emit,
      props: props
    });
    useLinkField(function () {
      return props.modelValue;
    });
    return function () {
      return _createVNode("div", {
        "class": bem([props.direction]),
        "role": "radiogroup"
      }, [slots.default == null ? void 0 : slots.default()]);
    };
  }
});