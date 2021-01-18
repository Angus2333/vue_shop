import { createVNode as _createVNode } from "vue";
import { watch } from 'vue';
import { createNamespace } from '../utils';
import { useChildren } from '@vant/use';

var _createNamespace = createNamespace('sidebar'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

export var SIDEBAR_KEY = 'vanSidebar';
export default createComponent({
  props: {
    modelValue: {
      type: [Number, String],
      default: 0
    }
  },
  emits: ['change', 'update:modelValue'],
  setup: function setup(props, _ref) {
    var emit = _ref.emit,
        slots = _ref.slots;

    var _useChildren = useChildren(SIDEBAR_KEY),
        linkChildren = _useChildren.linkChildren;

    var active = function active() {
      return +props.modelValue;
    };

    var setActive = function setActive(value) {
      if (value !== active()) {
        emit('change', value);
      }
    };

    watch(active, setActive);
    linkChildren({
      emit: emit,
      active: active,
      setActive: setActive
    });
    return function () {
      return _createVNode("div", {
        "class": bem()
      }, [slots.default == null ? void 0 : slots.default()]);
    };
  }
});