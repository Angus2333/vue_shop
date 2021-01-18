import { createVNode as _createVNode } from "vue";
import { createNamespace } from '../utils';

var _createNamespace = createNamespace('divider'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

export default createComponent({
  props: {
    dashed: Boolean,
    hairline: {
      type: Boolean,
      default: true
    },
    contentPosition: {
      type: String,
      default: 'center'
    }
  },
  setup: function setup(props, _ref) {
    var slots = _ref.slots;
    return function () {
      var _bem;

      return _createVNode("div", {
        "role": "separator",
        "class": bem((_bem = {
          dashed: props.dashed,
          hairline: props.hairline
        }, _bem["content-" + props.contentPosition] = !!slots.default, _bem))
      }, [slots.default == null ? void 0 : slots.default()]);
    };
  }
});