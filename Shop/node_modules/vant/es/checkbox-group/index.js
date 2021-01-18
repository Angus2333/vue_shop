import { createVNode as _createVNode } from "vue";
import { watch } from 'vue';
import { createNamespace } from '../utils';
import { CHECKBOX_KEY } from '../checkbox';
import { useChildren } from '@vant/use';
import { useExpose } from '../composables/use-expose';
import { useLinkField } from '../composables/use-link-field';

var _createNamespace = createNamespace('checkbox-group'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

export default createComponent({
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

    var _useChildren = useChildren(CHECKBOX_KEY),
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

    watch(function () {
      return props.modelValue;
    }, function (value) {
      emit('change', value);
    });
    useExpose({
      toggleAll: toggleAll
    });
    useLinkField(function () {
      return props.modelValue;
    });
    linkChildren({
      emit: emit,
      props: props
    });
    return function () {
      return _createVNode("div", {
        "class": bem([props.direction])
      }, [slots.default == null ? void 0 : slots.default()]);
    };
  }
});