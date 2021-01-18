import { createVNode as _createVNode } from "vue";
import _extends from "@babel/runtime/helpers/esm/extends";
import { createNamespace } from '../utils';
import { useParent } from '@vant/use';
import { useRoute, routeProps } from '../composables/use-route';
import { SIDEBAR_KEY } from '../sidebar';
import Badge from '../badge';

var _createNamespace = createNamespace('sidebar-item'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

export default createComponent({
  props: _extends({}, routeProps, {
    dot: Boolean,
    title: String,
    badge: [Number, String],
    disabled: Boolean
  }),
  emits: ['click'],
  setup: function setup(props, _ref) {
    var emit = _ref.emit,
        slots = _ref.slots;
    var route = useRoute();

    var _useParent = useParent(SIDEBAR_KEY),
        parent = _useParent.parent,
        index = _useParent.index;

    var onClick = function onClick() {
      if (props.disabled) {
        return;
      }

      emit('click', index.value);
      parent.emit('update:modelValue', index.value);
      parent.setActive(index.value);
      route();
    };

    return function () {
      var dot = props.dot,
          badge = props.badge,
          title = props.title,
          disabled = props.disabled;
      var selected = index.value === parent.active();
      return _createVNode("a", {
        "class": bem({
          select: selected,
          disabled: disabled
        }),
        "onClick": onClick
      }, [_createVNode(Badge, {
        "dot": dot,
        "content": badge,
        "class": bem('text')
      }, {
        default: function _default() {
          return [slots.title ? slots.title() : title];
        }
      })]);
    };
  }
});