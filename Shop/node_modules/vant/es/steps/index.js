import { createVNode as _createVNode } from "vue";
import { createNamespace } from '../utils';
import { useChildren } from '@vant/use';

var _createNamespace = createNamespace('steps'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

export var STEPS_KEY = 'vanSteps';
export default createComponent({
  props: {
    activeColor: String,
    inactiveIcon: String,
    inactiveColor: String,
    active: {
      type: [Number, String],
      default: 0
    },
    direction: {
      type: String,
      default: 'horizontal'
    },
    activeIcon: {
      type: String,
      default: 'checked'
    }
  },
  emits: ['click-step'],
  setup: function setup(props, _ref) {
    var emit = _ref.emit,
        slots = _ref.slots;

    var _useChildren = useChildren(STEPS_KEY),
        linkChildren = _useChildren.linkChildren;

    linkChildren({
      emit: emit,
      props: props
    });
    return function () {
      return _createVNode("div", {
        "class": bem([props.direction])
      }, [_createVNode("div", {
        "class": bem('items')
      }, [slots.default == null ? void 0 : slots.default()])]);
    };
  }
});