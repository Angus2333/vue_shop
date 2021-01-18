import { createVNode as _createVNode } from "vue";
import { computed } from 'vue';
import { createNamespace } from '../utils';
import { useParent } from '@vant/use';
import { ROW_KEY } from '../row';

var _createNamespace = createNamespace('col'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

export default createComponent({
  props: {
    offset: [Number, String],
    tag: {
      type: String,
      default: 'div'
    },
    span: {
      type: [Number, String],
      default: 0
    }
  },
  setup: function setup(props, _ref) {
    var slots = _ref.slots;

    var _useParent = useParent(ROW_KEY),
        parent = _useParent.parent,
        index = _useParent.index;

    var style = computed(function () {
      if (!parent) {
        return;
      }

      var spaces = parent.spaces;

      if (spaces && spaces.value && spaces.value[index.value]) {
        var _spaces$value$value = spaces.value[index.value],
            left = _spaces$value$value.left,
            right = _spaces$value$value.right;
        return {
          paddingLeft: left ? left + "px" : null,
          paddingRight: right ? right + "px" : null
        };
      }
    });
    return function () {
      var _bem;

      var tag = props.tag,
          span = props.span,
          offset = props.offset;
      return _createVNode(tag, {
        "style": style.value,
        "class": bem((_bem = {}, _bem[span] = span, _bem["offset-" + offset] = offset, _bem))
      }, {
        default: function _default() {
          return [slots.default == null ? void 0 : slots.default()];
        }
      });
    };
  }
});