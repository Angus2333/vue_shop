import { createVNode as _createVNode } from "vue";
import { createNamespace } from '../utils';
import { useChildren } from '@vant/use';

var _createNamespace = createNamespace('action-bar'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

export var ACTION_BAR_KEY = 'vanActionBar';
export default createComponent({
  props: {
    safeAreaInsetBottom: {
      type: Boolean,
      default: true
    }
  },
  setup: function setup(props, _ref) {
    var slots = _ref.slots;

    var _useChildren = useChildren(ACTION_BAR_KEY),
        linkChildren = _useChildren.linkChildren;

    linkChildren();
    return function () {
      return _createVNode("div", {
        "class": bem({
          unfit: !props.safeAreaInsetBottom
        })
      }, [slots.default == null ? void 0 : slots.default()]);
    };
  }
});