import { createVNode as _createVNode } from "vue";
import { addUnit, createNamespace } from '../utils';
import Badge from '../badge';

var _createNamespace = createNamespace('icon'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

function isImage(name) {
  return name ? name.indexOf('/') !== -1 : false;
}

export default createComponent({
  props: {
    dot: Boolean,
    name: String,
    size: [Number, String],
    badge: [Number, String],
    color: String,
    tag: {
      type: String,
      default: 'i'
    },
    classPrefix: {
      type: String,
      default: bem()
    }
  },
  setup: function setup(props, _ref) {
    var slots = _ref.slots;
    return function () {
      var tag = props.tag,
          dot = props.dot,
          name = props.name,
          size = props.size,
          badge = props.badge,
          color = props.color,
          classPrefix = props.classPrefix;
      var isImageIcon = isImage(name);
      return _createVNode(Badge, {
        "dot": dot,
        "tag": tag,
        "content": badge,
        "class": [classPrefix, isImageIcon ? '' : classPrefix + "-" + name],
        "style": {
          color: color,
          fontSize: addUnit(size)
        }
      }, {
        default: function _default() {
          return [slots.default == null ? void 0 : slots.default(), isImageIcon && _createVNode("img", {
            "class": bem('image'),
            "src": name
          }, null)];
        }
      });
    };
  }
});